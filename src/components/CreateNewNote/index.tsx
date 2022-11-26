import React from 'react';
import dayjs from 'dayjs';

import styles from './CreateNewNote.module.scss';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addNewNote } from '../../redux/slices/logicSlice';
import { changeColor, getColorFromLS, showAlert, uploadAndGetUrl } from '../../buisinessLogic';
import { RootState } from '../../redux/store';

interface CreateNewNoteProps {
  setCreateVis: React.Dispatch<React.SetStateAction<boolean>>;
}

export type FilesInfo = {
  id: string;
  fileName: string;
  fileUrl: string;
};

const CreateNewNote: React.FC<CreateNewNoteProps> = ({ setCreateVis }) => {
  const { chosenColor } = useSelector((state: RootState) => state.colors);
  const dispatch = useDispatch();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [date, setDate] = React.useState(dayjs().format('YYYY-MM-DD'));
  const [files, setFiles] = React.useState<File[]>([]);

  const newNoteRef = React.useRef(null);
  React.useEffect(() => {
    changeColor(newNoteRef, chosenColor);
  }, [chosenColor]);
  React.useEffect(() => {
    getColorFromLS(newNoteRef);
  }, []);

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputFiles = e.target.files;
    if (inputFiles && inputFiles.length > 5) {
      showAlert('Можно выбрать только 5 файлов', dispatch);
    }
    const newArr: File[] = [];
    if (inputFiles) {
      for (let i = 0; i < inputFiles.length; i++) {
        newArr.push(inputFiles[i]);
      }
    }
    setFiles(newArr);
  };

  const onClickCreate = async () => {
    if (title === '') {
      showAlert('Введите заголовок', dispatch);
    } else if (files.length > 0) {
      const newArray: [FilesInfo?] = [];
      for (let i = 0; i < files.length; i++) {
        if (i == files.length - 1) {
          await uploadAndGetUrl(files[i]).then((obj) => newArray.push(obj));
          axios
            .post(
              `${process.env.REACT_APP_HOST_URL}auth/addNote`,
              {
                title: title,
                description: description,
                date: date,
                dateCreate: new Date().toLocaleString(),
                files: newArray,
                complete: false,
                delay: false,
              },
              {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
              },
            )
            .then((res) => {
              showAlert(res.data.message, dispatch);
              setCreateVis(false);
              console.log(res.data.noteRes);
              dispatch(addNewNote(res.data.noteRes));
              console.log(res.data.noteRes);
            })
            .catch((e) => {
              showAlert(e.response.data.message, dispatch);
              if (e.response.data.message === 'Пользователь не авторизован.') {
                localStorage.removeItem('token');
              }
            });
        } else {
          await uploadAndGetUrl(files[i]).then((obj) => newArray.push(obj));
        }
      }
    } else {
      axios
        .post(
          `${process.env.REACT_APP_HOST_URL}auth/addNote`,
          {
            title: title,
            description: description,
            date: date,
            dateCreate: new Date().toLocaleString(),
            files: files,
            complete: false,
            delay: false,
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          },
        )
        .then((res) => {
          showAlert(res.data.message, dispatch);
          setCreateVis(false);
          dispatch(addNewNote(res.data.noteRes));
        })
        .catch((e) => {
          showAlert(e.response.data.message, dispatch);
          if (e.response.data.message === 'Пользователь не авторизован.') {
            localStorage.removeItem('token');
          }
        });
    }
  };

  return (
    <div ref={newNoteRef} className={styles.create_new_post}>
      <div className={styles.create_new_post_title}>
        <p>Заголовок</p>
        <input
          type="text"
          value={title}
          placeholder="Введите заголовок"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className={styles.create_new_post_description}>
        <p>Описание</p>
        <textarea
          value={description}
          placeholder="Введите описание записи"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className={styles.create_new_post_date}>
        <p>Дата, к которой нужно выполнить</p>
        <input
          type="date"
          min={dayjs().format('YYYY-MM-DD')}
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />
      </div>
      <div className={styles.create_new_post_files}>
        <p>Прикрепление файла к записи</p>
        <input type="file" onChange={onChangeFile} multiple={true} />
      </div>
      <div className={styles.create_new_post_createButton}>
        <button onClick={onClickCreate}>Создать запись</button>
      </div>
    </div>
  );
};

export default CreateNewNote;
