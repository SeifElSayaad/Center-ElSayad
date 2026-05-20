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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../auth/AuthContext';
import { updateProfile } from '../services/authApi';

import { FormInput } from '../components/FormInput';
import { PrimaryButton } from '../components/PrimaryButton';

import GuestProfileScreen from './GuestProfileScreen';
import BottomNav from '../components/BottomNav';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, signOut } = useAuth();

  if (!user) {
    return <GuestProfileScreen />;
  }

  const [fullName, setFullName] = useState(
    user ? `${user.firstName} ${user.lastName}` : 'John Doe'
  );
  const [email, setEmail] = useState(user?.email ?? 'johndoe@example.com');
  const [phone, setPhone] = useState(user?.phone ?? '');

  // Loading state so the button shows a spinner while the API call is in-flight
  const [isSaving, setIsSaving] = useState(false);

  async function handleSaveChanges() {
    // Split "Seif ElSayad" → firstName: "Seif", lastName: "ElSayad"
    // If the user only typed one word, it becomes the firstName and lastName is empty.
    const parts = fullName.trim().split(' ');
    const firstName = parts[0] ?? '';
    const lastName = parts.slice(1).join(' ') || '';

    if (!firstName) {
      Alert.alert('Validation', 'Please enter at least a first name.');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({ firstName, lastName, phone: phone || null });
      Alert.alert('Saved!', 'Your profile has been updated successfully.');
    } catch (err: any) {
      // Show the error message from the backend, or a generic fallback
      const message = err?.response?.data?.message ?? 'Something went wrong. Please try again.';
      Alert.alert('Error', message);
    } finally {
      // Always stop the loading spinner, even if there was an error
      setIsSaving(false);
    }
  }

  async function handleLogout() {
    await signOut();
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* ── Top Navigation Bar ── */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <TouchableOpacity 
            style={styles.iconBtn} 
            onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Home')}
          >
            <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="more-vert" size={24} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Profile Picture Section ── */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCz5evXIdtLmAuqM7iK47Tf-9scOCEBu2duyFKqhXPrjMz7pWsM07b03IAHr08D6L6lo7D4KFVlDTSqCoryklc383rxjD_TfJuYcvoenYzrTPX5QKPpFpvFQlDzbt9Qlca87pb8unZddWPNL2zBRrtSFC7z75jUOaamMwpAa7A_ijl9QeKPaSwnmfIq8dKUim1c2TfEqREH5Y6zS1UkMJ0sK0ZqTzbdjljmoDcT2JKNz794Vm2zhVis0ULrKNLvMZZ5wb41tm9QCGo' }} 
                style={styles.avatar} 
                resizeMode="cover"
              />
            </View>
            <TouchableOpacity style={styles.editAvatarBtn}>
              <MaterialIcons name="edit" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{fullName}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>

        {/* ── Personal Information Form ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.form}>
            <FormInput
              label="Full Name"
              icon="person"
              value={fullName}
              onChangeText={setFullName}
            />
            
            <FormInput
              label="Email Address"
              icon="mail"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            
            <FormInput
              label="Phone Number"
              icon="call"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
            
            <PrimaryButton
              label={isSaving ? 'Saving...' : 'Save Changes'}
              onPress={handleSaveChanges}
              disabled={isSaving}
              style={{ marginTop: 8 }}
            />

          </View>
        </View>

        {/* ── Quick Links / Account Settings ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <View style={styles.linksContainer}>
            <TouchableOpacity
              style={styles.linkItem}
              onPress={() => navigation.navigate('OrderHistory')}
            >
              <View style={styles.linkLeft}>
                <View style={[styles.linkIconBox, { backgroundColor: 'rgba(219,31,47,0.1)' }]}>
                  <MaterialIcons name="shopping-bag" size={24} color="#db1f2f" />
                </View>
                <View>
                  <Text style={styles.linkTitle}>My Orders</Text>
                  <Text style={styles.linkSubtitle}>Track and manage your purchases</Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
            </TouchableOpacity>

            
            <TouchableOpacity
              style={styles.linkItem}
              onPress={() => navigation.navigate('Address')}
            >
              <View style={styles.linkLeft}>
                <View style={styles.linkIconBox}>
                  <MaterialIcons name="location-on" size={24} color="#475569" />
                </View>
                <View>
                  <Text style={styles.linkTitle}>Shipping Addresses</Text>
                  <Text style={styles.linkSubtitle}>Manage delivery locations</Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
            </TouchableOpacity>

            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.linkItem} onPress={() => navigation.navigate('Settings')}>
              <View style={styles.linkLeft}>
                <View style={styles.linkIconBox}>
                  <MaterialIcons name="settings" size={24} color="#475569" />
                </View>
                <View>
                  <Text style={styles.linkTitle}>Settings</Text>
                  <Text style={styles.linkSubtitle}>App preferences and security</Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
            </TouchableOpacity>

            <View style={styles.divider} />
            
            <TouchableOpacity style={styles.linkItem} onPress={handleLogout}>
              <View style={styles.linkLeft}>
                <View style={[styles.linkIconBox, { backgroundColor: 'rgba(220,38,38,0.1)' }]}>
                  <MaterialIcons name="logout" size={24} color="#dc2626" />
                </View>
                <View>
                  <Text style={[styles.linkTitle, { color: '#dc2626' }]}>Logout</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom spacer */}
        <View style={{ height: 24 }} />
      </ScrollView>

      <BottomNav activeTab="Profile" />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8f6f6',
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 44,
    paddingBottom: 16,
    zIndex: 50,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  // Scroll
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 80, paddingHorizontal: 16 },
  // Profile Section
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarContainer: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
    borderColor: '#fff',
    overflow: 'hidden',
    backgroundColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#db1f2f',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  userEmail: {
    marginTop: 4,
    fontSize: 15,
    color: '#64748b',
  },
  // Sections
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },
  form: {
    gap: 4,
  },
  // Links
  linksContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  linkIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  linkSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  // Bottom Nav
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingHorizontal: 16,
  },
  navItem: {
    alignItems: 'center',
    gap: 2,
    flex: 1,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
});
