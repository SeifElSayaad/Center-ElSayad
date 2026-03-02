/**
 * AuthDivider
 * A reusable "──── or ────" divider used in Login and Register screens.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AuthDividerProps {
  label?: string;
}

export function AuthDivider({ label = 'or' }: AuthDividerProps) {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>{label}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
});
