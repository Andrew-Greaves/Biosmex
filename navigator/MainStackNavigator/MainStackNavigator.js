import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../../screens/LoginScreen/LoginScreen';
import HomeScreen from '../../screens/HomeScreen/HomeScreen';
import RegisterScreen from '../../screens/RegisterScreen/RegisterScreen';
import BuyInputsScreen from '../../screens/BuyInputsScreen/BuyInputsScreen';
import CheckoutScreen from '../../screens/CheckoutScreen/CheckoutScreen';
import ProfileScreen from '../../screens/ProfileScreen/ProfileScreen';
import FarmRegistrationScreen from '../../screens/RegisterScreen/FarmRegistrationScreen';
import ForgotPinScreen from '../../screens/ForgotPinScreen/ForgotPinScreen';

const Stack = createNativeStackNavigator();

const MainStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{
        headerShown: false
      }}
    />
     <Stack.Screen
      name="BuyInputs"
      component={BuyInputsScreen}
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
      name="Profile"
      component={ProfileScreen}
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
   <Stack.Screen
      name="FarmRegistration"
      component={FarmRegistrationScreen}
      options={{
        headerShown: false
      }}
    />
    <Stack.Screen
      name="ForgotPin"
      component={ForgotPinScreen}
      options={{
        headerShown: false
      }}
    />
    
    <Stack.Screen
      name="Checkout"
      component={CheckoutScreen}
      options={{
        headerShown: false
      }}
    />
    
  </Stack.Navigator>
);

export default MainStackNavigator;