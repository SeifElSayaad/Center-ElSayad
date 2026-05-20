import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ScreenHeader from '../components/ScreenHeader';
import { useAuthStore } from '../store/authStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { logout } = useAuthStore();

  // Local state for toggles
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // Placeholder for delete account API call
            Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
            logout();
          }
        },
      ]
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f6f6" />
      <ScreenHeader title="Settings" />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        {/* ── Notifications ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.card}>
            <View style={[styles.row, styles.rowBorder]}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(219,31,47,0.1)' }]}>
                  <MaterialIcons name="local-shipping" size={22} color="#db1f2f" />
                </View>
                <Text style={styles.rowText}>Order updates</Text>
              </View>
              <Switch
                value={orderUpdates}
                onValueChange={setOrderUpdates}
                trackColor={{ false: '#e2e8f0', true: '#db1f2f' }}
                thumbColor="#fff"
              />
            </View>
            
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(219,31,47,0.1)' }]}>
                  <MaterialIcons name="local-offer" size={22} color="#db1f2f" />
                </View>
                <Text style={styles.rowText}>Promotions & offers</Text>
              </View>
              <Switch
                value={promotions}
                onValueChange={setPromotions}
                trackColor={{ false: '#e2e8f0', true: '#db1f2f' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* ── Security ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.row}
              onPress={() => navigation.navigate('ChangePassword' as any)} // Will create this later
            >
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: '#f1f5f9' }]}>
                  <MaterialIcons name="lock-outline" size={22} color="#475569" />
                </View>
                <Text style={styles.rowText}>Change Password</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── App Preferences ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          <View style={styles.card}>
            <TouchableOpacity style={[styles.row, styles.rowBorder]}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: '#f1f5f9' }]}>
                  <MaterialIcons name="language" size={22} color="#475569" />
                </View>
                <Text style={styles.rowText}>Language</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.valueText}>English</Text>
                <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
              </View>
            </TouchableOpacity>
            
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: '#f1f5f9' }]}>
                  <MaterialIcons name="info-outline" size={22} color="#475569" />
                </View>
                <Text style={styles.rowText}>App Version</Text>
              </View>
              <Text style={styles.valueText}>v1.0.0</Text>
            </View>
          </View>
        </View>

        {/* ── Danger Zone ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.row} onPress={handleDeleteAccount}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(220,38,38,0.1)' }]}>
                  <MaterialIcons name="delete-outline" size={22} color="#dc2626" />
                </View>
                <Text style={[styles.rowText, { color: '#dc2626' }]}>Delete Account</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8f6f6',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 10,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  valueText: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
  },
});
