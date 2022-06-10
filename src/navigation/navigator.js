import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import LawScreen from '../screens/LawScreen';
import ContentScreen from '../screens/ContentScreen';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}>
      <Stack.Screen
        name="Content"
        component={ContentScreen}
        initialParams={{id: '', type: ''}}
      />

      <Stack.Screen name="Law" component={LawScreen} initialParams={{id: ''}} />
    </Stack.Navigator>
  );
};
