import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Main from './src/pages/Main/Main';
import Map from './src/pages/Map/Map';
const App = (): JSX.Element => {
  const Stack = createNativeStackNavigator();
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="main"
          screenOptions={{
            headerShown: false,
            statusBarColor: '#000',
            statusBarAnimation: 'fade',
          }}>
          <Stack.Screen name="main" component={Main} />
          <Stack.Screen name="map" component={Map} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
