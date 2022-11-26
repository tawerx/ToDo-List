import React from 'react';
import styles from './Root.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import Welcome from '../../components/Welcome';
import { getColorFromLS } from '../../buisinessLogic';
import Alert from '../../components/alert';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const Root = () => {
  const { alertVis } = useSelector((state: RootState) => state.alert);
  const navigate = useNavigate();
  const headerTitleRef = React.useRef(null);

  React.useEffect(() => {
    getColorFromLS(headerTitleRef);
    if (localStorage.token && localStorage.userName) {
      navigate(`user/${localStorage.userName}`);
    }
  }, []);

  return (
    <div className="wrapper">
      {alertVis && <Alert />}
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
