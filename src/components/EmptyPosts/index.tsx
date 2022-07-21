import React from 'react';

import styles from './EmptyPost.module.scss';

const EmptyPosts: React.FC = () => {
  return (
    <div className={styles.root}>
      <p>
        Записей нет или они не найдены. Вы можете добавить пару заметок, чтобы они отображались
        здесь. {`:)`}
      </p>
    </div>
  );
};

export default EmptyPosts;
