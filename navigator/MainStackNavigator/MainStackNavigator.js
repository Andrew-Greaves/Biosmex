import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../../screens/LoginScreen/LoginScreen';
import HomeScreen from '../../screens/HomeScreen/HomeScreen';
import RegisterScreen from '../../screens/RegisterScreen/RegisterScreen';
import BuyInputsScreen from '../../screens/BuyInputsScreen/BuyInputsScreen';

const Stack = createNativeStackNavigator();

const MainStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="BuyInputs"
      component={BuyInputsScreen}
      options={{
        headerShown: false
      }}
    />
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{
        headerShown: false
      }}
    />
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        headerShown: false
      }}
    />
    <Stack.Screen
      name="Register"
      component={RegisterScreen}
      options={{
        headerShown: false
      }}
    />
    
  </Stack.Navigator>
);

export default MainStackNavigator;