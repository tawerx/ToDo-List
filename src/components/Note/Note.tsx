import { async } from '@firebase/util';
import axios from 'axios';
import dayjs from 'dayjs';
import { deleteObject, ref } from 'firebase/storage';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { storage } from '../../firebase-config';
import { deleteNote, setUpdateComplete, setUpdateDelay } from '../../redux/slices/logicSlice';
import { RootState } from '../../redux/store';
import { changeColor, getColorFromLS } from '../../buisinessLogic';
import { FilesInfo } from '../CreateNewNote';
import EditNote from '../EditNote/EditNote';
import styles from './Note.module.scss';

type NoteProps = {
  _id: string;
  title: string;
  description: string;
  files: FilesInfo[];
  index: number;
  date: string;
  dateCreate: string;
  complete: boolean;
  delay: boolean;
};

const Note: React.FC<NoteProps> = ({
  title,
  description,
  files,
  _id,
  date,
  dateCreate,
  complete,
  delay,
  index,
}) => {
  const [deleteBar, setDeleteBar] = React.useState(false);
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = React.useState(false);
  const [editVis, setEditVis] = React.useState(false);
  const noteContainerRef = React.useRef(null);

  const { chosenColor } = useSelector((state: RootState) => state.colors);

  const onClickDelete = () => {
    if (localStorage.getItem('colors') != null && noteContainerRef.current) {
      const htmlElement = noteContainerRef.current as HTMLElement;
      const { wrapperColor } = JSON.parse(localStorage.getItem('colors') as string);
      htmlElement.style.backgroundColor = wrapperColor;
    } else if (noteContainerRef.current) {
      const htmlElement = noteContainerRef.current as HTMLElement;
      htmlElement.style.backgroundColor = '#d9d9d9';
    }

    setDeleteBar(true);
    setIsVisible(false);
    setTimeout(clickDelete, 1000);
  };

  const onClickComplete = () => {
    axios
      .put(
        `${process.env.REACT_APP_HOST_URL}auth/updateNote`,
        { _id, obj: { complete: true } },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } },
      )
      .then((res) => {
        complete = true;
        dispatch(setUpdateComplete(_id));

        if (complete && noteContainerRef.current) {
          const htmlElement = noteContainerRef.current as HTMLElement;
          htmlElement.style.backgroundColor = 'lime';
        }
      });
  };
  const onClickEdit = () => {
    setEditVis(true);
  };

  const clickDelete = () => {
    deletePost();
    setDeleteBar(false);
  };

  const deletePost = () => {
    axios
      .delete(`${process.env.REACT_APP_HOST_URL}auth/delete`, {
        data: { deleteId: _id },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then(() => {
        dispatch(deleteNote(_id));
        files.forEach(async (obj) => {
          const noteRef = ref(storage, `files/${obj.fileName}`);
          await deleteObject(noteRef);
        });
      });
  };

  const onDelayHandle = async () => {
    axios
      .put(
        `${process.env.REACT_APP_HOST_URL}auth/updateNote`,
        { _id, obj: { delay: true } },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } },
      )
      .then((res) => {
        delay = true;
        dispatch(setUpdateDelay(_id));

        if (delay && noteContainerRef.current) {
          const htmlElement = noteContainerRef.current as HTMLElement;
          htmlElement.style.backgroundColor = 'red';
        }
      });
  };

  React.useEffect(() => {
    changeColor(noteContainerRef, chosenColor);
    if (delay && noteContainerRef.current) {
      const htmlElement = noteContainerRef.current as HTMLElement;
      htmlElement.style.backgroundColor = 'red';
    }
    if (complete && noteContainerRef.current) {
      const htmlElement = noteContainerRef.current as HTMLElement;
      htmlElement.style.backgroundColor = 'lime';
    }
  }, [chosenColor]);
  React.useEffect(() => {
    getColorFromLS(noteContainerRef);
    if (!delay && !complete) {
      if (dayjs().format('YYYY-MM-DD') > date) {
        onDelayHandle();
      }
    }
    if (delay && noteContainerRef.current) {
      const htmlElement = noteContainerRef.current as HTMLElement;
      htmlElement.style.backgroundColor = 'red';
    }
    if (complete && noteContainerRef.current) {
      const htmlElement = noteContainerRef.current as HTMLElement;
      htmlElement.style.backgroundColor = 'lime';
    }
  }, []);

  if (editVis) {
    return (
      <div ref={noteContainerRef} className="edit-note-container">
        <EditNote
          _id={_id}
          title={title}
          description={description}
          files={files}
          date={date}
          dateCreate={dateCreate}
          setEditVis={setEditVis}
        />
      </div>
    );
  }

  return (
    <div ref={noteContainerRef} className={styles.note}>
      {deleteBar && <div className="progress-value-delete"></div>}
      <div
        className={isVisible ? styles.note_title_full : styles.note_title}
        onClick={() => setIsVisible(!isVisible)}>
        {isVisible && <span>Заголовок</span>}
        <p>{title}</p>
      </div>

      {isVisible && (
        <>
          <div
            className={
              description.length > 0 ? styles.note_description : styles.note_description_empty
            }>
            <span>Описание</span>
            <p>{description}</p>
          </div>
          <div className={styles.note_date_create || 'note_date_create'}>
            <span>Запись создана {dateCreate}</span>
          </div>
          <div className={styles.note_date || 'note_date'}>
            <span>Нужно выполнить к {date}</span>
          </div>
          {files.length > 0 ? (
            <div className={styles.note_files}>
              <span>Прикрепленные файлы:</span>
              <ul>
                {files.map((obj) => {
                  return (
                    <a key={obj.id} href={obj.fileUrl} target="_blank">
                      <li>{obj.fileName.slice(0, obj.fileName.indexOf(obj.id))}</li>
                    </a>
                  );
                })}
              </ul>
            </div>
          ) : null}
          {!complete && !delay && (
            <div className={styles.note_edit_button || 'note_edit_button'}>
              <button onClick={onClickEdit}>Редактировать</button>
            </div>
          )}
          <div className={styles.note_control_buttons}>
            <button className={styles.note_control_buttons_delete} onClick={onClickDelete}>
              Удалить
            </button>
            {!complete && !delay && (
              <button className={styles.note_control_buttons_complete} onClick={onClickComplete}>
                Завершить
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Note;
