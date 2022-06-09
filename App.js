import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, Layout, Text} from '@ui-kitten/components';

import {AppNavigator} from './src/navigation/navigator';
import store from './src/redux/store';

export default function App() {
  return (
    <Provider store={store}>
      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ApplicationProvider>
    </Provider>
  );
}
