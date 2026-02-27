import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
          <TouchableOpacity style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
        </View>

        {/* ── Logo + Heading ── */}
        <View style={styles.heroSection}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>
            Please sign in to continue to your account
          </Text>
        </View>

        {/* ── Form ── */}
        <View style={styles.form}>
          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. yourname@example.com"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Enter your password"
                placeholderTextColor="#94a3b8"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <MaterialIcons
                  name={passwordVisible ? 'visibility' : 'visibility-off'}
                  size={20}
                  color="#94a3b8"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity style={styles.continueBtn} activeOpacity={0.85}>
            <Text style={styles.continueBtnText}>Continue</Text>
            <MaterialIcons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>

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

        {/* ── Social Buttons ── */}
        <View style={styles.socialButtons}>
          {/* Google */}
          <TouchableOpacity style={styles.socialBtn}>
            <View style={styles.googleIcon}>
              {/* Simple G logo using color blocks */}
              <Text style={styles.googleG}>G</Text>
            </View>
            <Text style={styles.socialBtnText}>Sign in with Google</Text>
          </TouchableOpacity>

          {/* Apple */}
          <TouchableOpacity style={styles.socialBtn}>
            <MaterialIcons name="apple" size={20} color="#0f172a" />
            <Text style={styles.socialBtnText}>Sign in with Apple</Text>
          </TouchableOpacity>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            No account yet?{' '}
            <Text style={styles.signUpLink}>Sign up</Text>
          </Text>
          <View style={styles.securedBy}>
            <Text style={styles.securedText}>Secured by</Text>
            <View style={styles.clerkBadge}>
              <Text style={styles.clerkC}>C</Text>
            </View>
            <Text style={styles.clerkText}>Clerk</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f6f7f8',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 44,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  // Top bar
  topBar: {
    marginBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Hero
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
  },
  logo: {
    width: 128,
    height: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  },
  // Form
  form: {
    marginBottom: 24,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#0f172a',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  passwordWrapper: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    top: 0,
    height: 48,
    justifyContent: 'center',
  },
  continueBtn: {
    marginTop: 16,
    height: 48,
    backgroundColor: '#E31E24',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#E31E24',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  continueBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  forgotBtn: {
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 4,
  },
  forgotText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  // Divider
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
  // Social
  socialButtons: {
    gap: 12,
    marginBottom: 32,
  },
  socialBtn: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  googleIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleG: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  socialBtnText: {
    color: '#334155',
    fontWeight: '600',
    fontSize: 14,
  },
  // Footer
  footer: {
    alignItems: 'center',
    gap: 16,
  },
  footerText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  signUpLink: {
    color: '#E31E24',
    fontWeight: '700',
  },
  securedBy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    opacity: 0.6,
  },
  securedText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  clerkBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clerkC: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  clerkText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '700',
  },
});
