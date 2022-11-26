import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Color, setChosenColor } from '../../redux/slices/colorsSlice';
import { setClear } from '../../redux/slices/logicSlice';
import { RootState } from '../../redux/store';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../alert';

import styles from './Header.module.scss';

const Header = () => {
  const navigate = useNavigate();
  const { colors } = useSelector((state: RootState) => state.colors);
  const dispatch = useDispatch();
  const exitRef = React.useRef(null);

  const [alertMessage, setAlertMessage] = React.useState('');
  const [showAlert, setShowAlert] = React.useState(false);

  const headerTitleRef = React.useRef(null);
  const headerAddButtonRef = React.useRef(null);

  const onClickChangeColor = ({ colorName, bodyColor, wrapperColor }: Color) => {
    localStorage.setItem(
      'colors',
      JSON.stringify({ bodyColor: bodyColor, wrapperColor: wrapperColor }),
    );
    dispatch(setChosenColor(wrapperColor));
    document.body.style.backgroundColor = bodyColor;
    if (headerTitleRef.current) {
      const htmlElement = headerTitleRef.current as HTMLElement;
      htmlElement.style.backgroundColor = wrapperColor;
    }

    if (headerAddButtonRef.current) {
      const htmlElement = headerAddButtonRef.current as HTMLElement;
      htmlElement.style.backgroundColor = wrapperColor;
    }
    if (exitRef.current) {
      const htmlElement = exitRef.current as HTMLElement;
      htmlElement.style.backgroundColor = wrapperColor;
    }
  };

  React.useEffect(() => {
    if (localStorage.getItem('colors') != null) {
      const { bodyColor, wrapperColor } = JSON.parse(localStorage.getItem('colors') as string);
      document.body.style.backgroundColor = bodyColor;
      if (headerTitleRef.current) {
        const htmlElement = headerTitleRef.current as HTMLElement;
        htmlElement.style.backgroundColor = wrapperColor;
      }

      if (headerAddButtonRef.current) {
        const htmlElement = headerAddButtonRef.current as HTMLElement;
        htmlElement.style.backgroundColor = wrapperColor;
      }
      if (exitRef.current) {
        const htmlElement = exitRef.current as HTMLElement;
        htmlElement.style.backgroundColor = wrapperColor;
      }
    }
  }, []);

  return (
    <>
      <div className={styles.header}>
        <div className={styles.header_top}>
          <div ref={headerTitleRef} className={styles.header_title}>
            <Link to="/">
              <h1>ToDo List</h1>
            </Link>
          </div>
          {localStorage.token && (
            <div className={styles.exit_button}>
              <button
                ref={exitRef}
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('userName');
                  dispatch(setClear());
                  navigate('/');
                }}>
                Выйти
              </button>
            </div>
          )}
        </div>
        <div className={styles.header_select_color}>
          {colors.map((obj) => {
            return (
              <div
                onClick={() => onClickChangeColor(obj)}
                key={obj.id}
                className={obj.colorName}></div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Header;
