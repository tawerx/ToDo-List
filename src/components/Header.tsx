import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Color, setChosenColor, setColorFlag } from '../redux/slices/colorsSlice';
import { setTitle, setFlag, setClear } from '../redux/slices/logic';
import { RootState } from '../redux/store';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Alert from './alert';

const Header = () => {
  const navigate = useNavigate();
  const { colors } = useSelector((state: RootState) => state.colors);
  const dispatch = useDispatch();
  const { title } = useSelector((state: RootState) => state.logic);
  const inputRef = React.useRef(null);
  const exitRef = React.useRef(null);

  const [alertMessage, setAlertMessage] = React.useState('');
  const [showAlert, setShowAlert] = React.useState(false);

  const onClickAddPost = () => {
    if (title == 'Введите заметку' || title == '') {
      // alert('Вы не ввели название заметки');
      setAlertMessage('Вы не ввели название заметки');
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
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
          // alert(res.data.message);
          setAlertMessage(res.data.message);
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        })
        .catch((e) => {
          // alert(e.response.data.message);
          setAlertMessage(e.response.data.message);
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
          if (e.response.data.message === 'Пользователь не авторизован.') {
            localStorage.removeItem('token');
            dispatch(setClear());
          }
        });
      dispatch(setTitle(''));
      const htmlElement = inputRef.current as unknown as HTMLElement;
      htmlElement.style.height = `42px`;
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
    <>
      <>{showAlert && <Alert message={alertMessage} />}</>
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
                  localStorage.removeItem('userName');
                  dispatch(setClear());
                  navigate('/');
                }}>
                Выйти
              </button>
            </div>
          )}
        </div>
        <div className="header--add--post">
          <textarea
            placeholder="Введите заметку"
            ref={inputRef}
            className="header--search"
            value={title}
            onKeyUp={(e) => {
              const htmlElement = inputRef.current as unknown as HTMLElement;
              htmlElement.style.height = '42px';
              let scHeight = e.target.scrollHeight;
              htmlElement.style.height = `${scHeight}px`;
              if (scHeight > 40) {
                htmlElement.style.borderTopRightRadius = '0px';
                htmlElement.style.borderBottomRightRadius = '0px';
              } else {
                htmlElement.style.borderTopRightRadius = '20px';
                htmlElement.style.borderBottomRightRadius = '20px';
              }
            }}
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
    </>
  );
};

export default Header;
