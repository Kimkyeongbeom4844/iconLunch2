import React, {useRef, useState, useCallback, useEffect} from 'react';
import {SafeAreaView, Image, Pressable, Animated} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BoldP, RegularP} from './style';

const Main = ({
  navigation,
}: NativeStackScreenProps<any, 'main'>): JSX.Element => {
  const opacityAnim = useRef<Animated.CompositeAnimation>();
  const opacityValue = useRef<Animated.Value>(new Animated.Value(0)).current;
  const [onPressP, setOnPressP] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      opacityAnim.current = Animated.loop(
        Animated.sequence([
          Animated.timing(opacityValue, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(opacityValue, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      );
      opacityAnim.current.start();
    }, []),
  );

  useEffect(() => {
    if (typeof opacityAnim.current !== 'undefined') {
      if (onPressP === true) {
        opacityAnim.current.reset();
      } else {
        opacityAnim.current.start();
      }
    }
  }, [onPressP]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#FCFCFC',
        justifyContent: 'center',
        gap: 14,
      }}>
      <BoldP
        style={{
          textAlign: 'center',
          fontSize: 30,
        }}>
        오늘 점심 뭐먹지?
      </BoldP>
      <Pressable
        onPressIn={() => setOnPressP(true)}
        onPressOut={() => setOnPressP(false)}
        onPress={() => navigation.navigate('map')}
        style={{
          alignSelf: 'center',
        }}>
        {({pressed}) =>
          pressed === true ? (
            <Image
              source={require('../../assets/images/jokebear3.gif')}
              resizeMode={'cover'}
              style={{
                maxWidth: 300,
                height: 300,
              }}
            />
          ) : (
            <Image
              source={require('../../assets/images/jokebear4.png')}
              resizeMode={'cover'}
              style={{
                maxWidth: 300,
                height: 300,
              }}
            />
          )
        }
      </Pressable>
      <RegularP
        style={{
          textAlign: 'center',
          opacity: opacityValue,
          fontSize: 16,
          color: 'rgba(0,0,0,.7)',
        }}>
        {onPressP === false ? '농담곰에게 물어보세요' : ' '}
      </RegularP>
    </SafeAreaView>
  );
};

export default Main;
