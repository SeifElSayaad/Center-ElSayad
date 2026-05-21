import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ScreenHeader from '../components/ScreenHeader';
import { useAddressStore } from '../store/addressStore';
import { Address } from '../services/addressApi';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Address'>;

export default function AddressScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { addresses, selectedAddressId, fetchAddresses, selectAddress, isLoading, error } = useAddressStore();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSelect = (address: Address) => {
    selectAddress(address.id);
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f6f6" />
      <ScreenHeader title="Select Address" backgroundColor="#f8f6f6" />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator color="#db1f2f" style={{ marginTop: 40 }} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : addresses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="location-off" size={48} color="#E5E7EB" />
            <Text style={styles.emptyText}>No saved addresses yet</Text>
            <Text style={styles.emptySubText}>Add your first delivery address below</Text>
          </View>
        ) : (
          addresses.map((address) => {
            const isSelected = address.id === selectedAddressId;
            return (
              <TouchableOpacity
                key={address.id}
                style={[styles.addressCard, isSelected && styles.addressCardSelected]}
                onPress={() => handleSelect(address)}
                activeOpacity={0.8}
              >
                <View style={styles.cardLeft}>
                  <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                </View>
                <View style={styles.cardInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.addressName}>{address.fullName}</Text>
                    {address.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                    {address.label && (
                      <View style={styles.labelBadge}>
                        <Text style={styles.labelBadgeText}>{address.label}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.addressLine}>{address.street}</Text>
                  <Text style={styles.addressLine}>{address.city}{address.state ? `, ${address.state}` : ''}, {address.country}</Text>
                  <Text style={styles.addressPhone}>{address.phone}</Text>
                </View>
                {isSelected && (
                  <MaterialIcons name="check-circle" size={22} color="#db1f2f" />
                )}
              </TouchableOpacity>
            );
          })
        )}

        {/* Add new address button */}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddAddress')}
          activeOpacity={0.8}
        >
          <MaterialIcons name="add-location-alt" size={22} color="#db1f2f" />
          <Text style={styles.addBtnText}>Add New Address</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8f6f6' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 16 },
  addressCard: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 16,
    marginBottom: 14, flexDirection: 'row', alignItems: 'flex-start',
    borderWidth: 2, borderColor: 'transparent',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  addressCardSelected: { borderColor: '#db1f2f' },
  cardLeft: { paddingTop: 2, marginRight: 14 },
  radioOuter: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: '#D1D5DB',
    alignItems: 'center', justifyContent: 'center',
  },
  radioOuterSelected: { borderColor: '#db1f2f' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#db1f2f' },
  cardInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 4 },
  addressName: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  defaultBadge: {
    backgroundColor: '#FFF0F0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
  },
  defaultBadgeText: { fontSize: 10, fontWeight: '700', color: '#db1f2f' },
  labelBadge: {
    backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
  },
  labelBadgeText: { fontSize: 10, fontWeight: '600', color: '#6B7280' },
  addressLine: { fontSize: 13, color: '#6B7280', lineHeight: 20 },
  addressPhone: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  emptyContainer: { alignItems: 'center', marginTop: 60, gap: 8 },
  emptyText: { fontSize: 16, fontWeight: '700', color: '#374151', marginTop: 8 },
  emptySubText: { fontSize: 13, color: '#9CA3AF' },
  errorText: { textAlign: 'center', color: '#db1f2f', marginTop: 40, fontSize: 14 },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, backgroundColor: '#FFF',
    borderRadius: 16, padding: 16, marginTop: 4,
    borderWidth: 1.5, borderColor: '#db1f2f', borderStyle: 'dashed',
  },
  addBtnText: { fontSize: 15, fontWeight: '700', color: '#db1f2f' },
});
