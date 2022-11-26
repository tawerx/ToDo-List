import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { getColorFromLS } from '../../buisinessLogic';
import styles from './Alert.module.scss';

const Alert: React.FC = () => {
  const { alertMessage } = useSelector((state: RootState) => state.alert);
  const alertWrapperRef = React.useRef(null);
  React.useEffect(() => {
    getColorFromLS(alertWrapperRef);
  }, []);

  return (
    <div ref={alertWrapperRef} className={styles.alert_container}>
      <div className={styles.alert}>
        <span>{alertMessage}</span>
      </div>
    </div>
  );
};

export default Alert;
