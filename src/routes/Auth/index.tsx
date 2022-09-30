import axios from 'axios';
import React from 'react';
import styles from './Auth.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setClear } from '../../redux/slices/logic';

const Auth = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const headerTitleRef = React.useRef(null);
  const wrapperRef = React.useRef(null);

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
      alert('Вы не ввели данные!');
    } else {
      axios
        .post(`${process.env.REACT_APP_API_URL}auth/registration`, {
          username,
          password,
        })
        .then(() => {
          axios
            .post(`${process.env.REACT_APP_API_URL}auth/login`, { username, password })
            .then((res) => {
              setPassword('');
              setUsername('');
              localStorage.setItem('userName', username);
              localStorage.setItem('token', res.data);
              navigate(`/user/${username}`);
            })
            .catch((e) => {
              alert(e.response.data.message);
              if (e.response.data.message === 'Пользователь не авторизован.') {
                localStorage.removeItem('token');
                dispatch(setClear());
              }
            });
        })
        .catch((e) => {
          alert(e.response.data.message);
          if (e.response.data.message === 'Пользователь не авторизован.') {
            localStorage.removeItem('token');
            dispatch(setClear());
          }
        });
    }
  };

  const onClickEnter = () => {
    if (username == '' || password == '') {
      alert('Вы не ввели данные!');
    } else {
      localStorage.setItem('userName', username);
      axios
        .post(`${process.env.REACT_APP_API_URL}auth/login`, { username, password })
        .then((res) => {
          setPassword('');
          setUsername('');
          localStorage.setItem('token', res.data);
          navigate(`/user/${username}`);
        })
        .catch((e) => {
          alert(e.response.data.message);
          if (e.response.data.message === 'Пользователь не авторизован.') {
            localStorage.removeItem('token');
            dispatch(setClear());
          }
        });
    }
  };

  return (
    <div className="wrapper">
      <div ref={headerTitleRef} className={styles.header_title}>
        <h1>ToDo List</h1>
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
