import React, {useState} from 'react';
import styles from './Main.module.css';
import 자만곰 from '../../assets/images/jokebear4.png';
import 만두곰 from '../../assets/images/jokebear3.gif';
import {useNavigate} from 'react-router-dom';

const Main = () => {
  const navigate = useNavigate();
  const [isTouch, setIsTouch] = useState(false);

  return (
    <div className={styles.wrap}>
      <h3>오늘 점심 뭐먹지?</h3>
      <img
        src={isTouch === true ? 만두곰 : 자만곰}
        width={300}
        height={300}
        alt={'자만곰'}
        style={{
          cursor: 'pointer',
          objectFit: 'cover',
        }}
        onTouchStart={() => setIsTouch(true)}
        onTouchEnd={() => navigate('/result')}
        onClick={() => navigate('/result')}
        onMouseOver={() => setIsTouch(true)}
        onMouseLeave={() => setIsTouch(false)}
      />
      <p className={styles.opacity_text}>농담곰에게 물어보세요</p>
    </div>
  );
};

export default Main;
