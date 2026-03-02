import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ScreenHeader from '../components/ScreenHeader';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9FB" />
      
      <ScreenHeader title="Forgot Password" backgroundColor="#F9F9FB" />

      <View style={styles.content}>
        {/* ── Icon ── */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBox}>
            <MaterialIcons name="lock-reset" size={32} color="#FFFFFF" />
          </View>
        </View>

        {/* ── Text ── */}
        <Text style={styles.heading}>Recover Access</Text>
        <Text style={styles.description}>
          Enter your email and we'll send a link to reset your password.
        </Text>

        {/* ── Form ── */}
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="john@example.com"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Send Reset Link</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLinkText}>Back to Login</Text>
        </TouchableOpacity>
      </View>

      {/* ── Footer ── */}
      <View style={styles.footer}>
        <View style={styles.line} />
        <Text style={styles.brandText}>EL SAYAD CENTER</Text>
        <View style={styles.line} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9F9FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 8 : 52,
    paddingBottom: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: 40,
    marginBottom: 24,
  },
  iconBox: {
    width: 64,
    height: 64,
    backgroundColor: '#DC2626',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DC2626',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    width: '100%',
    marginBottom: 24,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
  },
  button: {
    width: '100%',
    backgroundColor: '#DC2626',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#DC2626',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    paddingVertical: 10,
  },
  loginLinkText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  brandText: {
    marginHorizontal: 12,
    fontSize: 10,
    color: '#9CA3AF',
    letterSpacing: 1,
  },
});
