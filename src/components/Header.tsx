import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Color, setChosenColor, setColorFlag } from '../redux/slices/colorsSlice';
import { setTitle, addNewNote, setFlag, Notes, setFlagg } from '../redux/slices/logic';
import { RootState } from '../redux/store';
import axios from 'axios';

const Header = () => {
  const { colors } = useSelector((state: RootState) => state.colors);
  const dispatch = useDispatch();
  const { title, flag } = useSelector((state: RootState) => state.logic);
  const inputRef = React.useRef(null);
  const exitRef = React.useRef(null);
  const onClickAddPost = () => {
    if (title == 'Введите заметку' || title == '') {
      alert('Вы не ввели название заметки');
    } else {
      axios
        .post(
          `${process.env.REACT_APP_API_URL}auth/addNote`,
          {
            value: title,
            date: new Date().toLocaleString(),
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          },
        )
        .then((res) => {
          dispatch(setFlag());
          alert(res.data.message);
        })
        .catch((e) => {
          alert(e.response.data.message);
          if (e.response.data.message === 'Пользователь не авторизован.') {
            localStorage.removeItem('token');
            dispatch(setFlagg());
          }
        });
      dispatch(setTitle(''));
    }
  };

  const headerTitleRef = React.useRef(null);
  const headerAddButtonRef = React.useRef(null);

  const onClickChangeColor = ({ title, bodyColor, wrapperColor }: Color) => {
    localStorage.setItem(
      'colors',
      JSON.stringify({ bodyColor: bodyColor, wrapperColor: wrapperColor }),
    );
    dispatch(setChosenColor(wrapperColor));
    dispatch(setColorFlag());
    document.body.style.backgroundColor = bodyColor;
    if (headerTitleRef.current) {
      const htmlElement = headerTitleRef.current as HTMLElement;
      htmlElement.style.backgroundColor = wrapperColor;
    }

    if (headerAddButtonRef.current) {
      const htmlElement = headerAddButtonRef.current as HTMLElement;
      htmlElement.style.backgroundColor = wrapperColor;
    }
    if (exitRef.current) {
      const htmlElement = exitRef.current as HTMLElement;
      htmlElement.style.backgroundColor = wrapperColor;
    }
  };

  React.useEffect(() => {
    if (localStorage.getItem('colors') != null) {
      const { bodyColor, wrapperColor } = JSON.parse(localStorage.getItem('colors') as string);
      document.body.style.backgroundColor = bodyColor;
      if (headerTitleRef.current) {
        const htmlElement = headerTitleRef.current as HTMLElement;
        htmlElement.style.backgroundColor = wrapperColor;
      }

      if (headerAddButtonRef.current) {
        const htmlElement = headerAddButtonRef.current as HTMLElement;
        htmlElement.style.backgroundColor = wrapperColor;
      }
      if (exitRef.current) {
        const htmlElement = exitRef.current as HTMLElement;
        htmlElement.style.backgroundColor = wrapperColor;
      }
    }
  }, []);

  return (
    <div className="header">
      <div className="header-top">
        <div ref={headerTitleRef} className="header--title">
          <h1>ToDo List</h1>
        </div>
        {localStorage.token && (
          <div className="exit-button">
            <button
              ref={exitRef}
              onClick={() => {
                localStorage.removeItem('token');
                dispatch(setFlagg());
              }}>
              Выйти
            </button>
          </div>
        )}
      </div>
      <div className="header--add--post">
        <input
          placeholder="Введите заметку"
          ref={inputRef}
          className="header--search"
          type="text"
          value={title}
          onChange={(e) => dispatch(setTitle(e.target.value))}
        />

        <button
          ref={headerAddButtonRef}
          onClick={onClickAddPost}
          className="header--add--new--post">
          Добавить заметку
        </button>
      </div>
      <div className="header--select--color">
        {colors.map((obj) => {
          return (
            <div onClick={() => onClickChangeColor(obj)} key={obj.id} className={obj.title}></div>
          );
        })}
      </div>
    </div>
  );
};

export default Header;
