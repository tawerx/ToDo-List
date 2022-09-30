import React from 'react';
import styles from './Welcome.module.scss';

const Welcome = () => {
  const wrapperRef = React.useRef(null);

  React.useEffect(() => {
    if (localStorage.getItem('colors') != null) {
      const { bodyColor, wrapperColor } = JSON.parse(localStorage.getItem('colors') as string);
      document.body.style.backgroundColor = bodyColor;
      if (wrapperRef.current) {
        const htmlElement = wrapperRef.current as HTMLElement;
        htmlElement.style.backgroundColor = wrapperColor;
      }
    }
  }, []);

  return (
    <div ref={wrapperRef} className={styles.root}>
      Хочешь сделать заметку, чтобы что-то не забыть, или наоборот поставить себе какую-то задачу
      или цель, то авторизируйся и сделай это {`:)`}
    </div>
  );
};

export default Welcome;
