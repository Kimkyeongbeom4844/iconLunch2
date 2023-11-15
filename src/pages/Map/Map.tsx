import React, {useState, useRef, useCallback, useEffect} from 'react';
import {
  SafeAreaView,
  useWindowDimensions,
  Image,
  View,
  Pressable,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {KakaoMapView} from '@jiggag/react-native-kakao-maps';
import Geolocation from '@react-native-community/geolocation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {BoldP, RegularP} from './style';

const Map = () => {
  const {width: windowWidth} = useWindowDimensions();
  const [textDot, setTextDot] = useState<string>('.');
  const dotTimer = useRef<NodeJS.Timeout>();
  const watchPositionId = useRef<number>();
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  }>();

  useFocusEffect(
    useCallback(() => {
      watchPositionId.current = Geolocation.watchPosition(
        position => {
          console.log(position.coords);
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          console.log(error);
        },
      );

      return () => {
        clearTimeout(dotTimer.current);
        if (typeof watchPositionId.current === 'number') {
          Geolocation.clearWatch(watchPositionId.current);
        }
      };
    }, []),
  );

  useEffect(() => {
    dotTimer.current = setInterval(() => {
      switch (textDot) {
        case '':
        case '.':
        case '..':
          setTextDot(currentState => '.'.repeat(currentState.length + 1));
          break;
        default:
          setTextDot('');
          break;
      }
    }, 500);
    return () => {
      clearTimeout(dotTimer.current);
    };
  }, [textDot]);

  return (
    <>
      {typeof coords !== 'undefined' ? (
        // success
        <SafeAreaView>
          <View
            style={{
              position: 'relative',
            }}>
            <KakaoMapView
              markerList={[
                {
                  lat: coords.latitude,
                  lng: coords.longitude,
                  markerName: '내 위치',
                },
              ]}
              width={windowWidth}
              height={500}
              centerPoint={{
                lat: coords.latitude,
                lng: coords.longitude,
              }}
              onChange={event => {
                console.log(event.nativeEvent);
              }}
            />
            <Pressable
              onPress={() => null}
              style={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                backgroundColor: '#FCFCFC',
                borderRadius: 50,
                padding: 10,
                borderColor: '#ddd',
                borderWidth: 1,
              }}>
              {({pressed}) => (
                <MaterialCommunityIcons
                  name="target"
                  color={
                    pressed === true ? 'rgba(0, 0, 0, .6)' : 'rgba(0, 0, 0, 1)'
                  }
                  size={50}
                />
              )}
            </Pressable>
          </View>
          <RegularP>123</RegularP>
        </SafeAreaView>
      ) : (
        // loading
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: '#FCFCFC',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../assets/images/jokebear2.gif')}
            style={{
              width: 300,
              height: 300,
            }}
          />
          <BoldP
            style={{
              fontSize: 20,
              fontWeight: 'normal',
            }}>
            맛집을 알아오는 중{textDot}
          </BoldP>
        </SafeAreaView>
      )}
    </>
  );
};

export default Map;
