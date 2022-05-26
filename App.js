import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';

import {AppNavigator} from './src/navigation/navigator';
import store from './src/redux/store';

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}
