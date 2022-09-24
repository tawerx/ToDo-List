import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteNote, Notes, setFlag } from '../redux/slices/logic';
import { RootState } from '../redux/store';

type NoteProps = {
  id: string;
  value: string;
  index: number;
  date: string;
};

const Note: React.FC<NoteProps> = ({ value, id, date, index }) => {
  const [completeBar, setCompleteBar] = React.useState(false);
  const [deleteBar, setDeleteBar] = React.useState(false);
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = React.useState(false);
  const postContainerRef = React.useRef(null);

  const { flag, chosenColor } = useSelector((state: RootState) => state.colors);

  const onClickClear = () => {
    setDeleteBar(true);
    setTimeout(clickDelete, 2000);
  };

  const onClickComplete = () => {
    setCompleteBar(true);
    setTimeout(clickComplete, 2000);
  };

  const clickDelete = () => {
    deletePost();
    setDeleteBar(false);
  };

  const clickComplete = () => {
    deletePost();
    setCompleteBar(false);
  };

  const deletePost = () => {
    axios
      .delete('https://todo-list-with-mongo.herokuapp.com//auth/delete', {
        data: { deleteId: id },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then(() => dispatch(deleteNote(id)));
  };

  const onClickVisible = () => {
    if (completeBar == false && deleteBar == false) {
      setIsVisible(!isVisible);
    }
  };

  React.useEffect(() => {
    if (postContainerRef.current) {
      const htmlElement = postContainerRef.current as HTMLElement;
      htmlElement.style.backgroundColor = chosenColor;
    }
  }, [flag]);

  React.useEffect(() => {
    if (localStorage.getItem('colors') != null) {
      const { bodyColor, wrapperColor } = JSON.parse(localStorage.getItem('colors') as string);
      document.body.style.backgroundColor = bodyColor;
      if (postContainerRef.current) {
        const htmlElement = postContainerRef.current as HTMLElement;
        htmlElement.style.backgroundColor = wrapperColor;
      }
    }
  }, []);

  return (
    <div onClick={onClickVisible} className="content">
      <div className="content--post">
        <div className="content--post--id">
          <span>{index + 1 + '.'}</span>
        </div>

        <div ref={postContainerRef} className="content--post--container">
          {completeBar && <div className="progress-value-complete"></div>}
          {deleteBar && <div className="progress-value-delete"></div>}
          <div className="content-post-time">
            <p>{date}</p>
          </div>
          <div className="content--post--title">
            <h2>{value}</h2>
          </div>
          {isVisible && (
            <div className="post-button-control">
              <button onClick={onClickClear} className="deleteButton">
                Удалить
              </button>
              <button onClick={onClickComplete} className="completeButton">
                Завершить
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Note;
