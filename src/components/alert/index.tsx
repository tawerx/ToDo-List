import React, { Dispatch, SetStateAction } from 'react';
import styles from './Alert.module.scss';

type AlertProps = {
  message: string;
  // setAlert: Dispatch<SetStateAction<boolean>>;
};

const Alert: React.FC<AlertProps> = ({ message }) => {
  const alertWrapperRef = React.useRef(null);
  React.useEffect(() => {
    if (localStorage.getItem('colors') != null) {
      const { wrapperColor } = JSON.parse(localStorage.getItem('colors') as string);

      if (alertWrapperRef.current) {
        const htmlElement = alertWrapperRef.current as HTMLElement;
        htmlElement.style.backgroundColor = wrapperColor;
      }
    }
    console.log('render alert');
  }, []);

  return (
    <div ref={alertWrapperRef} className={styles.alert_container}>
      <div className={styles.alert}>
        <span>{message}</span>
        {/* <button onClick={() => setAlert(false)}>Подтвердить</button> */}
      </div>
    </div>
  );
};

export default Alert;
