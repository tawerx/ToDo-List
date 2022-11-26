import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { changeColor, getColorFromLS } from '../../buisinessLogic';

import styles from './EmptyPost.module.scss';

const EmptyPosts: React.FC = () => {
  const emptyPostRef = React.useRef(null);

  const { chosenColor } = useSelector((state: RootState) => state.colors);

  React.useEffect(() => {
    changeColor(emptyPostRef, chosenColor);
  }, [chosenColor]);

  React.useEffect(() => {
    getColorFromLS(emptyPostRef);
  }, []);

  return (
    <div ref={emptyPostRef} className={styles.root}>
      <p>
        Записей нет или они не найдены. Вы можете добавить пару заметок, чтобы они отображались
        здесь. {`:)`}
      </p>
    </div>
  );
};

export default EmptyPosts;
