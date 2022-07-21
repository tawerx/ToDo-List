import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Posts, setFlag } from '../redux/slices/logic';

type PostProps = {
  title: string;
  index: number;
};

const Post: React.FC<PostProps> = ({ title, index }) => {
  const [completeBar, setCompleteBar] = React.useState(false);
  const [deleteBar, setDeleteBar] = React.useState(false);
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = React.useState(false);

  const onClickClear = () => {
    setDeleteBar(true);
    setTimeout(clickDelete, 2000);
  };

  const onClickComplete = () => {
    setCompleteBar(true);
    setTimeout(clickComplete, 2000);
  };

  const colorRef = React.useRef(null);

  const clickDelete = () => {
    deletePost();
    setDeleteBar(false);
  };

  const clickComplete = () => {
    deletePost();
    setCompleteBar(false);
  };

  const deletePost = () => {
    let parsedArray: Posts[] = JSON.parse(localStorage.getItem('posts') as string);
    let findItem = parsedArray.findIndex((obj) => obj.title == title);
    parsedArray.splice(findItem, 1);
    localStorage.setItem('posts', JSON.stringify(parsedArray));
    dispatch(setFlag());
  };

  const onClickVisible = () => {
    if (completeBar == false && deleteBar == false) {
      setIsVisible(!isVisible);
    }
  };

  return (
    <div onClick={onClickVisible} className="content">
      <div className="content--post">
        <div className="content--post--id">
          <span>{index + 1 + '.'}</span>
        </div>
        <div ref={colorRef} className="content--post--container">
          {completeBar && <div className="progress-value-complete"></div>}
          {deleteBar && <div className="progress-value-delete"></div>}
          <div className="content--post--title">
            <h2>{title}</h2>
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

export default Post;
