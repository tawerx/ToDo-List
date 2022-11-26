import React from 'react';
import Header from '../../components/Header';
import EmptyPosts from '../../components/EmptyPosts';
import { useSelector, useDispatch } from 'react-redux';
import { setClear, setNotes } from '../../redux/slices/logicSlice';
import { RootState } from '../../redux/store';
import axios from 'axios';
import Note from '../../components/Note/Note';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '../../components/alert';
import styles from './Home.module.scss';
import CreateNewNote from '../../components/CreateNewNote';
import { showAlert } from '../../buisinessLogic';

const Home: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notes } = useSelector((state: RootState) => state.logic);
  const { alertVis } = useSelector((state: RootState) => state.alert);
  const [createVis, setCreateVis] = React.useState(false);

  React.useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST_URL}auth/getNote`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token') as string}` },
      })
      .then((res) => {
        dispatch(setNotes(res.data));
      })
      .catch((e) => {
        showAlert(e.response.data.message, dispatch);

        if (e.response.data.message === 'Пользователь не авторизован.') {
          localStorage.removeItem('token');
          dispatch(setClear());
          navigate('/');
        }
      });
  }, []);

  const emptyPosts = <EmptyPosts />;
  const postsItems = notes.map((obj, i) => {
    return <Note key={obj._id} {...obj} index={i} />;
  });
  React.useEffect(() => {
    if (localStorage.userName != userId) {
      showAlert('Пользователь не авторизован.', dispatch);

      navigate('/');
    }
  }, []);

  return (
    <>
      {alertVis && <Alert />}
      <div className="wrapper">
        <Header />
        {!createVis && (
          <button onClick={() => setCreateVis(true)} className={styles.create_new_note_button}>
            Создать новую запись
          </button>
        )}
        {createVis ? (
          <CreateNewNote setCreateVis={setCreateVis} />
        ) : (
          <div className="container">{notes.length == 0 ? emptyPosts : postsItems}</div>
        )}
      </div>
    </>
  );
};

export default Home;
