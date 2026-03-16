import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ScreenHeader from '../components/ScreenHeader';
import { resetPassword } from '../services/authApi';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;
type ResetPasswordRouteProp = RouteProp<RootStackParamList, 'ResetPassword'>;

export default function ResetPasswordScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ResetPasswordRouteProp>();
  const { email } = route.params;

  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleResetPassword() {
    setError(null);

    if (!code.trim()) {
      setError('Please enter the 6-digit code.');
      return;
    }

    if (code.trim().length !== 6) {
      setError('The reset code must be exactly 6 digits.');
      return;
    }

    if (!newPassword) {
      setError('Please enter a new password.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email, code.trim(), newPassword);
      Alert.alert(
        'Password Reset',
        'Your password has been reset successfully. You can now login with your new password.',
        [{ text: 'Go to Login', onPress: () => navigation.navigate('Login') }],
      );
    } catch (err: any) {
      const message =
        err?.response?.data?.error ?? 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9FB" />

      <ScreenHeader title="Reset Password" backgroundColor="#F9F9FB" />

      <View style={styles.content}>
        {/* ── Icon ── */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBox}>
            <MaterialIcons name="vpn-key" size={30} color="#FFFFFF" />
          </View>
        </View>

        {/* ── Text ── */}
        <Text style={styles.heading}>Enter Reset Code</Text>
        <Text style={styles.description}>
          We sent a 6-digit code to{' '}
          <Text style={styles.emailHighlight}>{email}</Text>. Enter it below along
          with your new password.
        </Text>

        {/* ── Code Input ── */}
        <Text style={styles.label}>Reset Code</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="pin" size={20} color="#9CA3AF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter 6-digit code"
            placeholderTextColor="#9CA3AF"
            value={code}
            onChangeText={(text) => setCode(text.replace(/[^0-9]/g, '').slice(0, 6))}
            keyboardType="number-pad"
            maxLength={6}
            editable={!loading}
          />
        </View>

        {/* ── New Password ── */}
        <Text style={styles.label}>New Password</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="lock-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            placeholderTextColor="#9CA3AF"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showPassword}
            editable={!loading}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>

        {/* ── Confirm Password ── */}
        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="lock-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Re-enter new password"
            placeholderTextColor="#9CA3AF"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirm}
            editable={!loading}
          />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
            <MaterialIcons
              name={showConfirm ? 'visibility' : 'visibility-off'}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>

        {/* ── Error ── */}
        {error ? (
          <View style={styles.errorBox}>
            <MaterialIcons name="error-outline" size={16} color="#DC2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* ── Submit Button ── */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Reset Password</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backLink}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.backLinkText}>Didn't receive a code? Request again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9F9FB',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: 32,
    marginBottom: 20,
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
    marginBottom: 28,
  },
  emailHighlight: {
    color: '#DC2626',
    fontWeight: '600',
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
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '100%',
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    flex: 1,
  },
  button: {
    width: '100%',
    backgroundColor: '#DC2626',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#DC2626',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backLink: {
    paddingVertical: 10,
  },
  backLinkText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },
});
