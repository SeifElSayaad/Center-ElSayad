import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface PasswordInputProps extends TextInputProps {
  label: string;
  error?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
}

export function PasswordInput({ label, error, icon = 'lock', style, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <MaterialIcons 
          name={icon} 
          size={20} 
          color="#94a3b8" 
          style={styles.inputIcon} 
        />
        <TextInput
          style={[
            styles.input, 
            styles.inputWithIcon, 
            styles.passwordInput,
            error ? styles.inputError : null,
            style
          ]}
          placeholderTextColor="#94a3b8"
          secureTextEntry={!visible}
          {...props}
        />
        <TouchableOpacity 
          style={styles.eyeBtn} 
          onPress={() => setVisible(!visible)}
          activeOpacity={0.7}
        >
          <MaterialIcons 
            name={visible ? 'visibility' : 'visibility-off'} 
            size={20} 
            color="#94a3b8" 
          />
        </TouchableOpacity>
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
  passwordInput: {
    paddingRight: 48,
  },
  eyeBtn: {
    position: 'absolute',
    right: 16,
    height: '100%',
    justifyContent: 'center',
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
