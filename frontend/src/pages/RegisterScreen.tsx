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
import { registerB2C, Gender } from '../services/authApi';
import { useAuth } from '../auth/AuthContext';

// Reusable Components
import { FormInput } from '../components/FormInput';
import { PasswordInput } from '../components/PasswordInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { ErrorBox } from '../components/ErrorBox';
import { SocialButtons } from '../components/SocialButtons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();

  const { signIn } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister() {
    setError(null);

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!termsAccepted) {
      setError('You must accept the Terms & Conditions to continue.');
      return;
    }

    try {
      setLoading(true);
      const { token, user } = await registerB2C({ firstName, lastName, email, phone, password, gender: gender ?? undefined });
      await signIn(token, user);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (err: any) {
      const serverMsg = err?.response?.data?.message;
      const networkMsg = err?.message;
      const message = serverMsg ?? networkMsg ?? 'Something went wrong. Please try again.';
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

      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Heading ── */}
        <View style={styles.heroSection}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us to get started with your journey.</Text>
        </View>

        {/* ── Form ── */}
        <View style={styles.form}>

          {/* First Name + Last Name (side by side) */}
          <View style={styles.nameRow}>
            <FormInput
              containerStyle={{ flex: 1, marginRight: 8 }}
              label="First Name"
              placeholder="John"
              icon="person"
              value={firstName}
              onChangeText={setFirstName}
            />
            <FormInput
              containerStyle={{ flex: 1 }}
              label="Last Name"
              placeholder="Doe"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <FormInput
            label="Email Address"
            placeholder="john@example.com"
            icon="mail"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <FormInput
            label="Phone Number"
            placeholder="+20 10 0000 0000"
            icon="phone"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <PasswordInput
            label="Password"
            placeholder="Min. 8 characters"
            value={password}
            onChangeText={setPassword}
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {/* Gender */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderRow}>
              {(['MALE', 'FEMALE', ] as Gender[]).map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.genderBtn, gender === g && styles.genderBtnActive]}
                  onPress={() => setGender(g)}
                >
                  <Text style={[styles.genderBtnText, gender === g && styles.genderBtnTextActive]}>
                    {g === 'MALE' ? '♂ Male' : g === 'FEMALE' ? '♀ Female' : '— Prefer not to say'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Terms Checkbox */}
          <View style={styles.termsRow}>
            <TouchableOpacity
              style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}
              onPress={() => setTermsAccepted(!termsAccepted)}
            >
              {termsAccepted && <MaterialIcons name="check" size={14} color="#fff" />}
            </TouchableOpacity>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>
          </View>

          <ErrorBox message={error} />

          <PrimaryButton
            label="Sign Up"
            loading={loading}
            onPress={handleRegister}
          />
        </View>

        {/* ── Divider ── */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <SocialButtons textPrefix="Sign up" />

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text style={styles.logInLink} onPress={() => navigation.navigate('Login')}>Log In</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f6f7f8' },
  scrollContent: { flexGrow: 1, paddingBottom: 40, paddingHorizontal: 24 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 44,
    paddingBottom: 16,
    backgroundColor: 'rgba(246, 247, 248, 0.95)',
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  logo: { height: 32, width: 100 },
  heroSection: { marginBottom: 24, marginTop: 8 },
  title: { fontSize: 32, fontWeight: '800', color: '#0f172a', letterSpacing: -0.5, marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#64748b', lineHeight: 22 },
  form: { marginBottom: 24 },
  nameRow: { flexDirection: 'row', marginBottom: 0, gap: 8 },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6, marginLeft: 4 },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 4, marginBottom: 20, paddingHorizontal: 4 },
  checkbox: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#cbd5e1',
    backgroundColor: '#fff', marginRight: 12, marginTop: 2, alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: '#E31E24', borderColor: '#E31E24' },
  termsText: { flex: 1, fontSize: 13, color: '#475569', lineHeight: 22 },
  termsLink: { color: '#E31E24', fontWeight: '700' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  dividerText: { marginHorizontal: 16, color: '#64748b', fontSize: 14, fontWeight: '500' },
  footer: { alignItems: 'center', marginBottom: 32 },
  footerText: { color: '#475569', fontSize: 15, fontWeight: '500' },
  logInLink: { color: '#E31E24', fontWeight: '700' },
  // Gender selector
  genderRow: { flexDirection: 'row', gap: 8 },
  genderBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 12,
    borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  genderBtnActive: { borderColor: '#E31E24', backgroundColor: '#fef2f2' },
  genderBtnText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  genderBtnTextActive: { color: '#E31E24' },
});
