import React, {useEffect, useState} from 'react';
import {Map, MapMarker} from 'react-kakao-maps-sdk';
import styles from './Result.module.css';
import {BiChevronLeft} from 'react-icons/bi';
import {useNavigate} from 'react-router-dom';
import 공복곰 from '../../assets/images/jokebear.png';
import 호이곰 from '../../assets/images/jokebear2.gif';

const Result = () => {
  const navigate = useNavigate();
  const [isPressBackButton, setIsPressBackButton] = useState<boolean>(false);
  const [currentCoords, setCurrentCoords] = useState<{
    latitude: number;
    longitude: number;
  }>();
  const [error, setError] = useState<{code?: number; message: string}>();
  const [dot, setDot] = useState('');
  const [placeCoords, setPlaceCoords] = useState<{
    name: string;
    latitude: number;
    longitude: number;
  }>();

  useEffect(() => {
    const timer = setInterval(() => {
      switch (dot) {
        case '':
        case '.':
        case '..':
          setDot(currentState => '.'.repeat(currentState.length + 1));
          break;
        default:
          setDot('');
          break;
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [dot]);

  useEffect(() => {
    let watchId: number | undefined;
    (async () => {
      try {
        const response = await fetch('/coords.json');
        const data = await response.json();
        // console.log(data);
        const types = Object.keys(data);
        const selectType = types[Math.floor(Math.random() * 4)]; // 4개인이유 - 앞의 key4개가 한 중 일 양
        // console.log(selectType);
        const selectPlace =
          data[selectType][Math.floor(Math.random() * data[selectType].length)];
        console.log(selectPlace);
        setPlaceCoords({...selectPlace});
        watchId = navigator.geolocation.watchPosition(
          position => {
            console.log(position);
            setCurrentCoords({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          error => {
            console.log(error);
            switch (error.code) {
              case 1: // PERMISSION_DENIED
                setError({
                  code: error.code,
                  message: 'GPS를 키거나 접근허용 후 새로고침해주세요',
                });
                break;
              case 2: // POSITION_UNAVAILABLE
                setError({
                  code: error.code,
                  message: '사용자의 위치를 찾을수 없습니다',
                });
                break;
              case 3: // TIMEOUT
                // setError({
                //   code: error.code,
                //   message: '타임 아웃',
                // });
                window.location.reload();
                break;
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 3000,
          },
        );
      } catch (error) {
        console.log(error);
      }
    })();
    return () => {
      if (typeof watchId !== 'undefined') {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return (
    <>
      {typeof error !== 'undefined' ? (
        <div
          className={styles.wrap}
          style={{
            justifyContent: 'center',
          }}>
          <h4
            style={{
              width: 220,
            }}>
            {error.message}
          </h4>
          <img
            src={공복곰}
            alt={'공복곰'}
            width={250}
            style={{
              objectFit: 'contain',
            }}
          />
          <div
            className={styles.reload_button}
            onClick={() => window.location.reload()}>
            새로고침
          </div>
        </div>
      ) : typeof currentCoords !== 'undefined' ? (
        <div className={styles.wrap}>
          <header className={styles.header}>
            <BiChevronLeft
              color={
                isPressBackButton === true ? 'rgba(0,0,0,.6)' : 'rgba(0,0,0,1)'
              }
              size={30}
              onClick={() => navigate('/')}
              onTouchEnd={() => navigate('/')}
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
          {typeof placeCoords !== 'undefined' ? (
            <>
              <Map
                center={{
                  // 지도의 중심좌표
                  lat: placeCoords?.latitude,
                  lng: placeCoords?.longitude,
                }}
                style={{
                  // 지도의 크기
                  width: '100%',
                  height: '350px',
                }}
                level={1}>
                <MapMarker
                  position={{
                    lat: placeCoords?.latitude,
                    lng: placeCoords?.longitude,
                  }}
                />
                {/* <MapMarker
                  position={{
                    lat: currentCoords?.latitude,
                    lng: currentCoords?.longitude,
                  }}
                /> */}
              </Map>
              <p>{placeCoords.name}</p>
            </>
          ) : null}
        </div>
      ) : (
        <div
          className={styles.wrap}
          style={{
            justifyContent: 'center',
          }}>
          <img
            src={호이곰}
            width={250}
            style={{
              objectFit: 'contain',
            }}
          />
          <h4>맛집 알아오는 중{dot}</h4>
        </div>
      )}
    </>
  );
};

export default Result;
