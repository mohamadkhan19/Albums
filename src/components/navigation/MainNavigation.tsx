import React from 'react';
import AlbumScreen from '../screens/AlbumScreen';
import PhotoScreen from '../screens/PhotoScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const MainNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={() => ({header: () => null})}
      initialRouteName="AlbumScreen">
      <Stack.Screen name="AlbumScreen" component={AlbumScreen} />
      <Stack.Screen name="PhotoScreen" component={PhotoScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigation;
