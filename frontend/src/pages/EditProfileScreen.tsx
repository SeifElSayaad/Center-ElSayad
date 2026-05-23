import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../auth/AuthContext';
import { updateProfile } from '../services/authApi';

import { FormInput } from '../components/FormInput';
import { PrimaryButton } from '../components/PrimaryButton';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;

export default function EditProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);

  // Email is read-only
  const email = user?.email || '';

  async function handleSaveChanges() {
    if (!firstName.trim()) {
      Alert.alert('Validation', 'Please enter your first name.');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({ 
        firstName: firstName.trim(), 
        lastName: lastName.trim(), 
        phone: phone.trim() || null 
      });
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to update profile. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <FormInput
            label="First Name"
            icon="person"
            value={firstName}
            onChangeText={setFirstName}
          />

          <FormInput
            label="Last Name"
            icon="person"
            value={lastName}
            onChangeText={setLastName}
          />
          
          <FormInput
            label="Phone Number"
            icon="call"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <View style={styles.readOnlyField}>
            <FormInput
              label="Email Address"
              icon="mail"
              value={email}
              onChangeText={() => {}} // no-op
              editable={false}
            />
            <Text style={styles.readOnlyNotice}>
              Email cannot be changed directly. Contact support if you need to update it.
            </Text>
          </View>
        </View>

        <PrimaryButton
          label={isSaving ? 'Saving...' : 'Save Changes'}
          onPress={handleSaveChanges}
          disabled={isSaving}
          style={styles.saveBtn}
        />
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 16 : 16,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f6f6',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  readOnlyField: {
    opacity: 0.7,
  },
  readOnlyNotice: {
    fontSize: 12,
    color: '#64748b',
    marginTop: -8,
    marginBottom: 12,
    marginLeft: 4,
  },
  saveBtn: {
    marginTop: 8,
  },
});
