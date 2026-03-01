import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: object;
  containerStyle?: object;
}

export default function SearchBar({ 
  placeholder = 'Search...', 
  value, 
  onChangeText,
  style,
  containerStyle 
}: SearchBarProps) {
  return (
    <View style={[styles.searchBar, containerStyle]}>
      <MaterialIcons name="search" size={20} color="#955056" style={styles.searchIcon} />
      <TextInput
        style={[styles.searchInput, style]}
        placeholder={placeholder}
        placeholderTextColor="#955056"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1b0e0f',
  },
});
