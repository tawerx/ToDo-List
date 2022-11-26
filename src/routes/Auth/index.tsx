import axios from 'axios';
import React from 'react';
import styles from './Auth.module.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setClear } from '../../redux/slices/logicSlice';
import Alert from '../../components/alert';
import { RootState } from '../../redux/store';
import { showAlert } from '../../buisinessLogic';

const Auth = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const headerTitleRef = React.useRef(null);
  const wrapperRef = React.useRef(null);
  const { alertVis } = useSelector((state: RootState) => state.alert);

  React.useEffect(() => {
    if (localStorage.getItem('colors') != null) {
      const { bodyColor, wrapperColor } = JSON.parse(localStorage.getItem('colors') as string);
      document.body.style.backgroundColor = bodyColor;
      if (headerTitleRef.current) {
        const htmlElement = headerTitleRef.current as HTMLElement;
        htmlElement.style.backgroundColor = wrapperColor;
      }
      if (wrapperRef.current) {
        const htmlElement = wrapperRef.current as HTMLElement;
        htmlElement.style.backgroundColor = wrapperColor;
      }
    }
    if (localStorage.token && username) {
      navigate(`../../user/${username}`);
    }
  }, []);

  const onClickReg = () => {
    if (username == '' || password == '') {
      showAlert('Вы не ввели данные!', dispatch);
    } else if (password.length < 5) {
      showAlert('Длина пароля меньше 5 символов!', dispatch);
    } else if (password.split('').includes(' ')) {
      showAlert('Пароль не должен содержать пробелы!', dispatch);
    } else {
      axios
        .post(`${process.env.REACT_APP_HOST_URL}auth/registration`, {
          username,
          password,
        })
        .then(() => {
          axios
            .post(`${process.env.REACT_APP_HOST_URL}auth/login`, {
              username,
              password,
            })
            .then((res) => {
              setPassword('');
              setUsername('');
              localStorage.setItem('userName', username);
              localStorage.setItem('token', res.data);
              navigate(`/user/${username}`);
            })
            .catch((e) => {
              showAlert(e.response.data.message, dispatch);

              if (e.response.data.message === 'Пользователь не авторизован.') {
                localStorage.removeItem('token');
                dispatch(setClear());
              }
            });
        })
        .catch((e) => {
          showAlert(e.response.data.message, dispatch);

          if (e.response.data.message === 'Пользователь не авторизован.') {
            localStorage.removeItem('token');
            dispatch(setClear());
          }
        });
    }
  };

  const onClickEnter = () => {
    if (username == '' || password == '') {
      showAlert('Вы не ввели данные!', dispatch);
    } else {
      localStorage.setItem('userName', username);
      axios
        .post(`${process.env.REACT_APP_HOST_URL}auth/login`, {
          username,
          password,
        })
        .then((res) => {
          setPassword('');
          setUsername('');
          localStorage.setItem('token', res.data);
          navigate(`/user/${username}`);
        })
        .catch((e) => {
          showAlert(e.response.data.message, dispatch);

          if (e.response.data.message === 'Пользователь не авторизован.') {
            localStorage.removeItem('token');
            dispatch(setClear());
          }
        });
    }
  };

  return (
    <div className="wrapper">
      {alertVis && <Alert />}
      <div ref={headerTitleRef} className={styles.header_title}>
        <Link to={'/'}>
          <h1>ToDo List</h1>
        </Link>
      </div>
      <div ref={wrapperRef} className={styles.auth_wrapper}>
        <div className={styles.auth_form}>
          <input
            value={username}
            placeholder="Имя пользователя"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            value={password}
            placeholder="Пароль"
            onChange={(e) => setPassword(e.target.value)}
          />
          {location.pathname == '/auth/registration' ? (
            <p>Минимальная длина пароля 4 символа</p>
          ) : null}
        </div>
        <div className={styles.auth_button_control}>
          {location.pathname == '/auth/login' ? (
            <button onClick={onClickEnter}>Войти</button>
          ) : (
            <button onClick={onClickReg}>Зарегистрироваться</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
