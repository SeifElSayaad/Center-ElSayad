import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SocialButtonsProps extends ViewProps {
  textPrefix?: string; // e.g. "Sign up" or "Sign in"
}

export function SocialButtons({ textPrefix = 'Continue', style, ...props }: SocialButtonsProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
        <MaterialIcons name="mail" size={24} color="#EA4335" />
        <Text style={styles.socialBtnText}>{textPrefix} with Gmail</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.socialBtn} activeOpacity={0.7}>
        <MaterialIcons name="facebook" size={24} color="#1877F2" />
        <Text style={styles.socialBtnText}>{textPrefix} with Facebook</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginBottom: 32,
  },
  socialBtn: {
    height: 52,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  googleIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleG: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  socialBtnText: {
    color: '#334155',
    fontWeight: '700',
    fontSize: 15,
  },
});
