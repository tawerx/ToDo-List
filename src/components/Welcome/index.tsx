import React from 'react';
import { getColorFromLS } from '../../buisinessLogic';
import styles from './Welcome.module.scss';

const Welcome = () => {
  const wrapperRef = React.useRef(null);

  React.useEffect(() => {
    getColorFromLS(wrapperRef);
  }, []);

  return (
    <div ref={wrapperRef} className={styles.root}>
      Хочешь сделать заметку, чтобы что-то не забыть, или наоборот поставить себе какую-то задачу
      или цель, то авторизируйся и сделай это {`:)`}
    </div>
  );
};

export default Welcome;
