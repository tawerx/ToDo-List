import React from 'react';
import styles from './Root.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import Welcome from '../../components/Welcome';

const Root = () => {
  const navigate = useNavigate();
  const headerTitleRef = React.useRef(null);

  React.useEffect(() => {
    if (localStorage.getItem('colors') != null) {
      const { bodyColor, wrapperColor } = JSON.parse(localStorage.getItem('colors') as string);
      document.body.style.backgroundColor = bodyColor;
      if (headerTitleRef.current) {
        const htmlElement = headerTitleRef.current as HTMLElement;
        htmlElement.style.backgroundColor = wrapperColor;
      }
    }
    if (localStorage.token && localStorage.userName) {
      navigate(`user/${localStorage.userName}`);
    }
  }, []);

  return (
    <div className="wrapper">
      <div ref={headerTitleRef} className={styles.header_title}>
        <h1>ToDo List</h1>
      </div>
      <Welcome />
      <div className={styles.button_control}>
        <Link to={`auth/login`}>
          <button className={styles.login}>Войти</button>
        </Link>
        <Link to={`auth/registration`}>
          <button className={styles.registration}>Зарегистрироваться</button>
        </Link>
      </div>
    </div>
  );
};

export default Root;
