import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import LawScreen from '../screens/LawScreen';
import ContentScreen from '../screens/ContentScreen';
import TestScreen from '../screens/TestScreen';
import SearchResultsScreen from '../screens/SearchResultsScreen';
import LawSearchScreen from '../screens/LawSearchScreen';

const Stack = createStackNavigator();
const SearchStack = createStackNavigator();
const ContentStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const SearchStackNavigator = () => {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen
        name="SearchResults"
        component={SearchResultsScreen}
        options={{headerShown: false}}
      />
      <SearchStack.Screen
        name="LawSearch"
        component={LawScreen}
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
    </SearchStack.Navigator>
  );
};

const ContentStackNavigator = () => {
  return (
    <ContentStack.Navigator>
      <ContentStack.Screen
        name="Content"
        component={ContentScreen}
        initialParams={{id: '', type: ''}}
        options={{headerShown: true}}
      />
      <ContentStack.Screen
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
    </ContentStack.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="Directory" component={ContentStackNavigator} />
      <Tab.Screen name="Search" component={SearchStackNavigator} />
      {/*    <Tab.Screen name="Test" component={TestScreen} /> */}
    </Tab.Navigator>
  );
};

/* export const AppNavigator = () => {
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

    <Stack.Screen
        name="Test"
        component={TestScreen}
        initialParams={{id: ''}}
      /> 
    </Stack.Navigator>
  );
}; */
