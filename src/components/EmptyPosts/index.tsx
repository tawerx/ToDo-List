import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

import styles from './EmptyPost.module.scss';

const EmptyPosts: React.FC = () => {
  const emptyPostRef = React.useRef(null);

  const { flag, chosenColor } = useSelector((state: RootState) => state.colors);

  React.useEffect(() => {
    if (emptyPostRef.current) {
      const htmlElement = emptyPostRef.current as HTMLElement;
      htmlElement.style.backgroundColor = chosenColor;
    }
  }, [flag]);

  React.useEffect(() => {
    const { bodyColor, wrapperColor } = JSON.parse(localStorage.getItem('colors') as string);
    document.body.style.backgroundColor = bodyColor;
    if (emptyPostRef.current) {
      const htmlElement = emptyPostRef.current as HTMLElement;
      htmlElement.style.backgroundColor = wrapperColor;
    }
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
