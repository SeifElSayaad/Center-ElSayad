/// <reference types="nativewind/types" />
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/auth/AuthContext';
import { initI18n } from './src/i18n';
import './src/i18n'; // import to ensure it's bundled

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initI18n().then(() => setIsReady(true));
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#db1f2f" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
