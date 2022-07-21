import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTitle, setFlag, Posts } from '../redux/slices/logic';
import { RootState } from '../redux/store';

const Header = () => {
  const dispatch = useDispatch();
  const { title, flag } = useSelector((state: RootState) => state.logic);
  const inputRef = React.useRef(null);
  const onClickAddPost = () => {
    let parsedArray: Posts[] = JSON.parse(localStorage.getItem('posts') as string);
    let findItem = parsedArray.find((obj) => obj.title == title);
    if (findItem) {
      alert('Такая запись уже создана');
      dispatch(setTitle(''));
    } else if (title == 'Введите заметку' || title == '') {
      alert('Вы не ввели название заметки');
    } else {
      parsedArray.push({ title: title });
      localStorage.setItem('posts', JSON.stringify(parsedArray));
      alert('Запись успешно добавлена!');
      dispatch(setTitle(''));
      dispatch(setFlag());
    }
  };

  return (
    <div className="header">
      <div className="header--title">
        <h1>ToDo List</h1>
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

        <button onClick={onClickAddPost} className="header--add--new--post">
          Добавить заметку
        </button>
      </div>
    </div>
  );
};

export default Header;
