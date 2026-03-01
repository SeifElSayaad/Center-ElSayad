import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, StyleProp, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface FormInputProps extends TextInputProps {
  label: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function FormInput({ label, icon, error, containerStyle, style, ...props }: FormInputProps) {
  return (
    <View style={[styles.fieldGroup, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        {icon && (
          <MaterialIcons 
            name={icon} 
            size={18} 
            color="#94a3b8" 
            style={styles.inputIcon} 
          />
        )}
        <TextInput
          style={[
            styles.input, 
            icon ? styles.inputWithIcon : null,
            error ? styles.inputError : null,
            style
          ]}
          placeholderTextColor="#94a3b8"
          {...props}
        />
      </View>
      {error && <Text style={styles.errorTextSmall}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    marginLeft: 4,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  input: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    fontSize: 15,
    color: '#0f172a',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  inputWithIcon: {
    paddingLeft: 48,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorTextSmall: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
