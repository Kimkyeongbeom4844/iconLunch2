import React, {useState} from 'react';
import {Map} from 'react-kakao-maps-sdk';
import styles from './Result.module.css';
import {BiChevronLeft} from 'react-icons/bi';
import {useNavigate} from 'react-router-dom';

const Result = () => {
  const navigate = useNavigate();
  const [isPressBackButton, setIsPressBackButton] = useState(false);
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <BiChevronLeft
          color={
            isPressBackButton === true ? 'rgba(0,0,0,.6)' : 'rgba(0,0,0,1)'
          }
          size={30}
          onClick={() => navigate(-1)}
          onTouchEnd={() => navigate(-1)}
          onTouchStart={() => setIsPressBackButton(true)}
          onMouseOver={() => setIsPressBackButton(true)}
          onMouseLeave={() => setIsPressBackButton(false)}
          style={{
            position: 'absolute',
            left: 0,
            cursor: 'pointer',
          }}
        />
        <h3>오늘의 메뉴</h3>
      </header>
      <Map
        center={{
          // 지도의 중심좌표
          lat: 33.450701,
          lng: 126.570667,
        }}
        style={{
          // 지도의 크기
          width: '100%',
          height: '350px',
        }}
        level={3}
      />
      <p>개발중..</p>
    </div>
  );
};

export default Result;
