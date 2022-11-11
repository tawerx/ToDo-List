import React from 'react';
import Header from '../components/Header';
import EmptyPosts from '../components/EmptyPosts';
import { useSelector, useDispatch } from 'react-redux';
import { setClear, setNotes } from '../redux/slices/logic';
import { RootState } from '../redux/store';
import axios from 'axios';
import Note from '../components/Note';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '../components/alert';

const Home: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { flag, notes } = useSelector((state: RootState) => state.logic);

  const [alertMessage, setAlertMessage] = React.useState('');
  const [showAlert, setShowAlert] = React.useState(false);

  React.useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}auth/getNote`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token') as string}` },
      })
      .then((res) => {
        dispatch(setNotes(res.data));
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
          navigate('/');
        }
      });
  }, [flag]);

  const emptyPosts = <EmptyPosts />;
  const postsItems = notes.map((obj, i) => {
    return <Note key={obj.id} {...obj} index={i} />;
  });

  React.useEffect(() => {
    if (localStorage.userName != userId) {
      // alert('Пользователь не авторизован.');
      setAlertMessage('Пользователь не авторизован');
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        console.log(1);
      }, 3000);
      navigate('/');
    }
  }, []);

  return (
    <>
      <>{showAlert && <Alert message={alertMessage} />}</>
      <div className="wrapper">
        <Header />

        <div className="container">{notes.length == 0 ? emptyPosts : postsItems}</div>
      </div>
    </>
  );
};

export default Home;
