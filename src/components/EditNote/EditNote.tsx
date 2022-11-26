import React from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { deleteObject, ref } from 'firebase/storage';
import { useDispatch } from 'react-redux';
import { storage } from '../../firebase-config';
import { setDeleteFile, setUpdateNote } from '../../redux/slices/logicSlice';
import { FilesInfo } from '../CreateNewPost';
import styles from './EditNote.module.scss';
import { showAlert, uploadAndGetUrl } from '../../buisinessLogic';

interface EditNoteProps {
  _id: string;
  title: string;
  description: string;
  files: FilesInfo[];
  date: string;
  dateCreate: string;
  setEditVis: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditNote: React.FC<EditNoteProps> = ({
  title,
  description,
  _id,
  files,
  date,
  dateCreate,
  setEditVis,
}) => {
  const dispatch = useDispatch();
  const [editTitle, setEditTitle] = React.useState(title);
  const [editDesc, setEditDesc] = React.useState(description);
  const [editDate, setEditDate] = React.useState(date);
  const [editFiles, setEditFiles] = React.useState<File[]>([]);

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputFiles = e.target.files;
    if (inputFiles && inputFiles.length > 5 - files.length) {
      return showAlert(`Можно выбрать только ${5 - files.length} файлов`, dispatch);
    }
    const newArr: File[] = [];
    if (inputFiles) {
      for (let i = 0; i < inputFiles.length; i++) {
        newArr.push(inputFiles[i]);
      }
    }
    setEditFiles(newArr);
  };

  const onClickEdit = async () => {
    if (
      title === editTitle &&
      editDesc === description &&
      editDate === date &&
      editFiles.length === 0
    ) {
      return showAlert('Вы ничего не изменили', dispatch);
    } else if (editFiles.length > 0) {
      const filesArray: FilesInfo[] = [...files];
      for (let i = 0; i < editFiles.length; i++) {
        if (i === editFiles.length - 1) {
          await uploadAndGetUrl(editFiles[i]).then((obj) => {
            filesArray.push(obj);
            files = filesArray;
            axios
              .put(
                `${process.env.REACT_APP_HOST_URL}auth/updateNote`,
                {
                  _id,
                  obj: {
                    title: editTitle,
                    description: editDesc,
                    date: editDate,
                    files: filesArray,
                  },
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } },
              )
              .then((res) => {
                showAlert('Запись отредактирована!', dispatch);
                dispatch(
                  setUpdateNote({ _id, editTitle, editDesc, editDate, editFiles: filesArray }),
                );
                setEditVis(false);
              });
          });
        } else {
          await uploadAndGetUrl(editFiles[i]).then((obj) => filesArray.push(obj));
        }
      }
    } else {
      try {
        axios
          .put(
            `${process.env.REACT_APP_HOST_URL}auth/updateNote`,
            { _id, obj: { title: editTitle, description: editDesc, date: editDate } },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } },
          )
          .then(async (res) => {
            showAlert('Запись отредактирована!', dispatch);
            dispatch(setUpdateNote({ _id, editTitle, editDesc, editDate, editFiles: files }));
            setEditVis(false);
          });
      } catch (error) {}
    }
  };

  const onClickDeleteFile = async (file: FilesInfo) => {
    try {
      const updateFiles = [...files];
      const findFile = files.findIndex((obj) => obj.id === file.id);
      updateFiles.splice(findFile, 1);
      files = updateFiles;

      axios
        .put(
          `${process.env.REACT_APP_HOST_URL}auth/updateNote`,
          { _id, obj: { files: files } },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } },
        )
        .then(async (res) => {
          const fileRef = ref(storage, `files/${file.fileName}`);
          await deleteObject(fileRef);

          dispatch(setDeleteFile({ noteId: _id, files }));

          showAlert('Файл удален', dispatch);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.edit_note}>
      <div className={styles.edit_note_title}>
        <span>Заголовок</span>
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Введите заголовок"
        />
      </div>
      <div className={styles.edit_note_description}>
        <span>Описание</span>
        <textarea
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          placeholder="Введите описание"
        />
      </div>
      <div className={styles.note_date_create}>
        <span>Запись создана {dateCreate}</span>
      </div>
      <div className={styles.edit_note_date}>
        <span>Нужно выполнить к</span>
        <input
          type="date"
          min={dayjs().format('YYYY-MM-DD')}
          value={editDate}
          onChange={(e) => setEditDate(e.target.value)}
        />
      </div>
      <div className={styles.edit_note_files}>
        {files.length > 0 && (
          <>
            <span>Прикрепленные файлы</span>
            <ul>
              {files.map((obj) => {
                return (
                  <li key={obj.id}>
                    <a href={obj.fileUrl}>{obj.fileName.slice(0, obj.fileName.indexOf(obj.id))}</a>
                    <button onClick={() => onClickDeleteFile(obj)}>Удалить</button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
        {files.length < 5 && (
          <>
            <input type="file" multiple={true} onChange={onChangeFile} />
          </>
        )}
      </div>
      <div className={styles.edit_note_control_buttons}>
        <button
          onClick={() => {
            setEditVis(false);
          }}>
          Назад
        </button>
        <button onClick={onClickEdit}>Редактировать</button>
      </div>
    </div>
  );
};

export default EditNote;
