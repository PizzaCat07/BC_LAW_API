import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import LawScreen from '../screens/LawScreen';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Law" component={LawScreen} />
    </Stack.Navigator>
  );
};
