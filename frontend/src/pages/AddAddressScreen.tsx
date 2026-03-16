import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ScreenHeader from '../components/ScreenHeader';
import { FormInput } from '../components/FormInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAddressStore } from '../store/addressStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddAddress'>;

export default function AddAddressScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { addAddress, selectAddress } = useAddressStore();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [label, setLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!street.trim()) newErrors.street = 'Street address is required';
    if (!city.trim()) newErrors.city = 'City is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const address = await addAddress({
        fullName: fullName.trim(),
        phone: phone.trim(),
        street: street.trim(),
        city: city.trim(),
        label: label.trim() || undefined,
      });
      selectAddress(address.id);
      navigation.goBack();
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? err?.message ?? 'Failed to save address';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.root}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F5F7" />
        <ScreenHeader title="New Address" backgroundColor="#F5F5F7" />

        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* Label chips */}
          <Text style={styles.sectionLabel}>LABEL (OPTIONAL)</Text>
          <View style={styles.chipRow}>
            {['Home', 'Office', 'Other'].map((chip) => (
              <TouchableOpacity
                key={chip}
                style={[styles.chip, label === chip && styles.chipSelected]}
                onPress={() => setLabel(label === chip ? '' : chip)}
              >
                <MaterialIcons
                  name={chip === 'Home' ? 'home' : chip === 'Office' ? 'business' : 'place'}
                  size={16}
                  color={label === chip ? '#FFF' : '#6B7280'}
                />
                <Text style={[styles.chipText, label === chip && styles.chipTextSelected]}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>ADDRESS DETAILS</Text>

          <FormInput
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="e.g. Ahmed El Sayad"
          />
          {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

          <FormInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="+20 100 000 0000"
            keyboardType="phone-pad"
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

          <FormInput
            label="Street Address"
            value={street}
            onChangeText={setStreet}
            placeholder="e.g. 12 El Tahrir St, Apt 3B"
          />
          {errors.street && <Text style={styles.errorText}>{errors.street}</Text>}

          <FormInput
            label="City"
            value={city}
            onChangeText={setCity}
            placeholder="e.g. Cairo"
          />
          {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

          <View style={{ height: 24 }} />

          <PrimaryButton
            label={loading ? 'Saving...' : 'Save Address'}
            onPress={handleSave}
            disabled={loading}
            loading={loading}
          />

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F5F7' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 16 },
  sectionLabel: {
    fontSize: 12, fontWeight: '700', color: '#9CA3AF',
    letterSpacing: 0.8, marginBottom: 12, marginTop: 8,
  },
  chipRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#F3F4F6', borderWidth: 1.5, borderColor: 'transparent',
  },
  chipSelected: { backgroundColor: '#D32F2F', borderColor: '#D32F2F' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  chipTextSelected: { color: '#FFF' },
  errorText: { fontSize: 12, color: '#D32F2F', marginTop: -8, marginBottom: 12, marginLeft: 4 },
});
