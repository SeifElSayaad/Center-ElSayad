import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../pages/HomeScreen';
import LoginScreen from '../pages/LoginScreen';
import RegisterScreen from '../pages/RegisterScreen';
import ProfileScreen from '../pages/ProfileScreen';
import CategoriesScreen from '../pages/CategoriesScreen';
import ProductDetailsScreen from '../pages/ProductDetailsScreen';
import ForgotPasswordScreen from '../pages/ForgotPasswordScreen';
import CartScreen from '../pages/CartScreen';
import CustomerOrderScreen from '../pages/CustomerOrderScreen';
import { Product } from '../components/ProductCard';

// ─── Route Types ──────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  Categories: { categoryName?: string };
  ProductDetails: { product: Product };
  ForgotPassword: undefined;
  Cart: undefined;
  CustomerOrder: undefined;
};

// ─── Navigator ────────────────────────────────────────────────────────────────

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }} // We use custom headers in each screen
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="CustomerOrder" component={CustomerOrderScreen} />
    </Stack.Navigator>
  );
}
