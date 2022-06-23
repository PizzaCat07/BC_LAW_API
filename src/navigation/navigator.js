import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import LawScreen from '../screens/LawScreen';
import ContentScreen from '../screens/ContentScreen';
import TestScreen from '../screens/TestScreen';
import SearchResultsScreen from '../screens/SearchResultsScreen';
import LawSearchScreen from '../screens/LawSearchScreen';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}>
      <Stack.Screen
        name="SearchResults"
        component={SearchResultsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LawSearch"
        component={LawSearchScreen}
        options={({route, navigation}) => {
          const title = route.params.title;
          return {
            title: title,
            headerStyle: {
              backgroundColor: 'orange',
            },
            headerTitleStyle: {
              fontSize: 18,
            },
          };
        }}
      />
      <Stack.Screen
        name="Content"
        component={ContentScreen}
        initialParams={{id: '', type: ''}}
      />
      <Stack.Screen
        name="Law"
        component={LawScreen}
        initialParams={{id: ''}}
        options={({route, navigation}) => {
          const title = route.params.title;
          return {
            title: title,
            headerStyle: {
              backgroundColor: 'orange',
            },
            headerTitleStyle: {
              fontSize: 18,
            },
          };
        }}
      />

      {/* <Stack.Screen
        name="Test"
        component={TestScreen}
        initialParams={{id: ''}}
      /> */}
    </Stack.Navigator>
  );
};
