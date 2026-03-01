import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ErrorBoxProps extends ViewProps {
  message: string | null;
}

export function ErrorBox({ message, style, ...props }: ErrorBoxProps) {
  if (!message) return null;

  return (
    <View style={[styles.errorBox, style]} {...props}>
      <MaterialIcons name="error-outline" size={16} color="#dc2626" />
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: '#dc2626',
    lineHeight: 18,
  },
});
