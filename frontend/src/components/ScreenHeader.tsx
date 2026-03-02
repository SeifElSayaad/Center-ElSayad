/**
 * ScreenHeader
 * A reusable header component used across most screens.
 * Shows an optional back arrow on the left and an optional title centered.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface ScreenHeaderProps {
  /** Title displayed centered in the header. */
  title?: string;
  /** Whether to show the back arrow button. Defaults to true. */
  showBack?: boolean;
  /** Custom right-side element, e.g. an icon button. */
  rightElement?: React.ReactNode;
  /** Override the background color (defaults to transparent / same as screen bg). */
  backgroundColor?: string;
}

export default function ScreenHeader({
  title,
  showBack = true,
  rightElement,
  backgroundColor = 'transparent',
}: ScreenHeaderProps) {
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Left: Back button or spacer */}
      {showBack ? (
        <TouchableOpacity style={styles.sideSlot} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
      ) : (
        <View style={styles.sideSlot} />
      )}

      {/* Center: Title */}
      {title ? <Text style={styles.title} numberOfLines={1}>{title}</Text> : <View style={{ flex: 1 }} />}

      {/* Right: Optional element or spacer */}
      <View style={styles.sideSlot}>{rightElement ?? null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 8 : 52,
    paddingBottom: 12,
  },
  sideSlot: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
});
