import React, {useEffect, useState} from 'react';
import {Map, MapMarker} from 'react-kakao-maps-sdk';
import styles from './Result.module.css';
import {BiChevronLeft} from 'react-icons/bi';
import {useNavigate} from 'react-router-dom';
import 공복곰 from '../../assets/images/jokebear.png';
import 호이곰 from '../../assets/images/jokebear2.gif';
import 그로밋마커 from '../../assets/images/gromit.png';

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
    address: string;
    type: string;
  }>();
  const [iframeLoad, setIframeLoad] = useState<boolean>(false);
  const [iframeError, setIframeError] = useState<string>();

  const geocoder = new window.kakao.maps.services.Geocoder();

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
        geocoder.coord2Address(
          selectPlace.longitude,
          selectPlace.latitude,
          async (result, status) => {
            console.log(result[0], status);
            setPlaceCoords({
              ...selectPlace,
              address: result[0].road_address?.address_name,
              type: selectType,
            });
            if (
              typeof process.env.REACT_APP_NAVER_CLIENT_ID === 'string' &&
              typeof process.env.REACT_APP_NAVER_CLIENT_SECRET === 'string'
            ) {
              const response = await fetch(
                `https://openapi.naver.com/v1/search/image?query=${selectPlace.name}`,
                {
                  headers: {
                    'X-Naver-Client-Id': process.env.REACT_APP_NAVER_CLIENT_ID,
                    'X-Naver-Client-Secret':
                      process.env.REACT_APP_NAVER_CLIENT_SECRET,
                  },
                },
              );
              const data = await response.json();
              console.log(data);
            }
          },
        );
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
            alignItems: 'center',
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
            onClick={() => window.history.go(0)}>
            새로고침
          </div>
        </div>
      ) : typeof currentCoords !== 'undefined' &&
        typeof placeCoords !== 'undefined' ? (
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
          <Map
            center={{
              lat: placeCoords.latitude,
              lng: placeCoords.longitude,
            }} // 지도의 중심좌표
            isPanto={true} // 부드럽게 이동
            style={{
              width: '100%',
              height: '300px',
            }} // 지도의 크기
            level={1} // 지도확대레벨
          >
            {/* 맛집 marker */}
            <MapMarker
              position={{
                lat: placeCoords.latitude,
                lng: placeCoords.longitude,
              }}
              image={{
                src: 그로밋마커,
                size: {
                  width: 69,
                  height: 65,
                }, // 마커이미지의 크기입니다
                options: {
                  offset: {
                    x: 32,
                    y: 60,
                  }, // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
                },
              }} //커스텀 마커 옵션
            />
          </Map>
          {/* 식당정보 */}
          <div className={styles.place_info_wrap}>
            <div>
              <img
                src={호이곰}
                width={250}
                style={{
                  objectFit: 'contain',
                }}
              />
              <h4>정보 가져오는 중{dot}</h4>
              <p>{placeCoords.name}</p>
              <p>{placeCoords.address}</p>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={styles.wrap}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
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
