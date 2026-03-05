import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewProps, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';
import { socialLogin, AuthResponse } from '../services/authApi';

// Complete any pending auth sessions on mount
WebBrowser.maybeCompleteAuthSession();

// ─── CREDENTIALS ──────────────────────────────────────────────────────────────
// Replace these with your real OAuth Client IDs.
// Google: https://console.cloud.google.com/apis/credentials
// Facebook: https://developers.facebook.com/apps/

const GOOGLE_WEB_CLIENT_ID    = 'YOUR_GOOGLE_WEB_CLIENT_ID';
const GOOGLE_ANDROID_CLIENT_ID = 'YOUR_GOOGLE_ANDROID_CLIENT_ID';
const GOOGLE_IOS_CLIENT_ID     = 'YOUR_GOOGLE_IOS_CLIENT_ID';
const FACEBOOK_APP_ID          = 'YOUR_FACEBOOK_APP_ID';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SocialButtonsProps extends ViewProps {
  textPrefix?: string;       // e.g. "Sign up" or "Sign in"
  onSuccess: (data: AuthResponse) => void;
  onError: (message: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SocialButtons({
  textPrefix = 'Continue',
  onSuccess,
  onError,
  style,
  ...props
}: SocialButtonsProps) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);

  // ── Google Auth ──

  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
  });

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const idToken = googleResponse.authentication?.idToken;
      if (idToken) {
        handleSocialAuth('google', idToken);
      } else {
        setGoogleLoading(false);
        onError('Google sign-in did not return an ID token.');
      }
    } else if (googleResponse?.type === 'error') {
      setGoogleLoading(false);
      onError(googleResponse.error?.message || 'Google sign-in failed.');
    } else if (googleResponse?.type === 'dismiss') {
      setGoogleLoading(false);
    }
  }, [googleResponse]);

  // ── Facebook Auth ──

  const [facebookRequest, facebookResponse, facebookPromptAsync] = Facebook.useAuthRequest({
    clientId: FACEBOOK_APP_ID,
  });

  useEffect(() => {
    if (facebookResponse?.type === 'success') {
      const accessToken = facebookResponse.authentication?.accessToken;
      if (accessToken) {
        handleSocialAuth('facebook', accessToken);
      } else {
        setFacebookLoading(false);
        onError('Facebook sign-in did not return an access token.');
      }
    } else if (facebookResponse?.type === 'error') {
      setFacebookLoading(false);
      onError(facebookResponse.error?.message || 'Facebook sign-in failed.');
    } else if (facebookResponse?.type === 'dismiss') {
      setFacebookLoading(false);
    }
  }, [facebookResponse]);

  // ── Shared handler ──

  async function handleSocialAuth(provider: 'google' | 'facebook', token: string) {
    try {
      const result = await socialLogin({ provider, idToken: token });
      onSuccess(result);
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.message ?? 'Social sign-in failed.';
      onError(message);
    } finally {
      setGoogleLoading(false);
      setFacebookLoading(false);
    }
  }

  // ── Render ──

  const isLoading = googleLoading || facebookLoading;

  return (
    <View style={[styles.container, style]} {...props}>
      <TouchableOpacity
        style={styles.socialBtn}
        activeOpacity={0.7}
        disabled={!googleRequest || isLoading}
        onPress={() => {
          setGoogleLoading(true);
          googlePromptAsync();
        }}
      >
        {googleLoading ? (
          <ActivityIndicator size="small" color="#EA4335" />
        ) : (
          <>
            <MaterialIcons name="mail" size={24} color="#EA4335" />
            <Text style={styles.socialBtnText}>{textPrefix} with Gmail</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.socialBtn}
        activeOpacity={0.7}
        disabled={!facebookRequest || isLoading}
        onPress={() => {
          setFacebookLoading(true);
          facebookPromptAsync();
        }}
      >
        {facebookLoading ? (
          <ActivityIndicator size="small" color="#1877F2" />
        ) : (
          <>
            <MaterialIcons name="facebook" size={24} color="#1877F2" />
            <Text style={styles.socialBtnText}>{textPrefix} with Facebook</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginBottom: 32,
  },
  socialBtn: {
    height: 52,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  socialBtnText: {
    color: '#334155',
    fontWeight: '700',
    fontSize: 15,
  },
});
