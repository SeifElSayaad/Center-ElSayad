import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { login } from '../services/authApi';
import { useAuth } from '../auth/AuthContext';

// Reusable Components
import { FormInput } from '../components/FormInput';
import { PasswordInput } from '../components/PasswordInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { ErrorBox } from '../components/ErrorBox';
import { SocialButtons } from '../components/SocialButtons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();

  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setError(null);
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    try {
      setLoading(true);
      const { token, user } = await login({ email, password });
      await signIn(token, user);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (err: any) {
      const message = err?.response?.data?.message ?? 'Invalid email or password.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f6f7f8" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Back Button ── */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
        </View>

        {/* ── Logo + Heading ── */}
        <View style={styles.heroSection}>
          <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Please sign in to continue to your account</Text>
        </View>

        {/* ── Form ── */}
        <View style={styles.form}>
          <FormInput
            label="Email address"
            placeholder="e.g. yourname@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            icon="lock-outline"
            value={password}
            onChangeText={setPassword}
          />

          <ErrorBox message={error} />

          <PrimaryButton
            label="Continue"
            loading={loading}
            onPress={handleLogin}
          />

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* ── Divider ── */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <SocialButtons textPrefix="Sign in" />

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            No account yet?{' '}
            <Text style={styles.signUpLink} onPress={() => navigation.navigate('Register')}>Sign up</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f6f7f8' },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 44,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  topBar: { marginBottom: 8 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  heroSection: { alignItems: 'center', marginBottom: 32, marginTop: 8 },
  logo: { width: 128, height: 64, marginBottom: 24 },
  title: { fontSize: 32, fontWeight: '700', color: '#0f172a', letterSpacing: -0.5, marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#64748b', textAlign: 'center', lineHeight: 22 },
  form: { marginBottom: 24 },
  forgotBtn: { alignItems: 'center', marginTop: 12, paddingVertical: 4 },
  forgotText: { color: '#64748b', fontSize: 14, fontWeight: '500' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  dividerText: { marginHorizontal: 16, color: '#64748b', fontSize: 14, fontWeight: '500' },
  footer: { alignItems: 'center', gap: 16 },
  footerText: { color: '#64748b', fontSize: 14, fontWeight: '500' },
  signUpLink: { color: '#E31E24', fontWeight: '700' },
});
