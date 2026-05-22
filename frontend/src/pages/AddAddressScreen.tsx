import React, { useState, useRef } from 'react';
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
  Modal,
  SafeAreaView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { WebView } from 'react-native-webview';

import { RootStackParamList } from '../navigation/AppNavigator';
import ScreenHeader from '../components/ScreenHeader';
import { FormInput } from '../components/FormInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAddressStore } from '../store/addressStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddAddress'>;

export default function AddAddressScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { addAddress, selectAddress } = useAddressStore();
  const webViewRef = useRef<WebView>(null);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [label, setLabel] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Map Modal State
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{lat: number, lng: number} | null>(null);

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

  const handleLocateMe = async () => {
    try {
      setMapLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const lat = location.coords.latitude;
      const lng = location.coords.longitude;
      
      setSelectedCoords({ lat, lng });

      // Inject JS to move the map
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`window.moveToLocation(${lat}, ${lng}); true;`);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not fetch your current location. Please ensure GPS is enabled.');
    } finally {
      setMapLoading(false);
    }
  };

  const handleConfirmLocation = async () => {
    if (!selectedCoords) {
      Alert.alert('No location selected', 'Please tap on the map to select a location first.');
      return;
    }

    try {
      setMapLoading(true);
      // Reverse geocoding using free Nominatim API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedCoords.lat}&lon=${selectedCoords.lng}&accept-language=en`
      );
      const data = await response.json();
      
      if (data && data.address) {
        const addr = data.address;
        const fetchedCity = addr.city || addr.town || addr.village || addr.county || '';
        const fetchedStreet = addr.road || '';
        const houseNum = addr.house_number ? `${addr.house_number} ` : '';
        
        if (fetchedCity) setCity(fetchedCity);
        if (fetchedStreet) setStreet(`${houseNum}${fetchedStreet}`);
      } else {
        Alert.alert('Warning', 'Could not automatically find street address for this location. Please enter it manually.');
      }
      setIsMapVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to get address from location.');
    } finally {
      setMapLoading(false);
    }
  };

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { padding: 0; margin: 0; }
        html, body, #map { height: 100%; width: 100vw; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([30.0444, 31.2357], 13); // Default to Cairo
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        var marker = L.marker([30.0444, 31.2357], {draggable: true}).addTo(map);

        function updatePosition(lat, lng) {
          window.ReactNativeWebView.postMessage(JSON.stringify({lat: lat, lng: lng}));
        }

        marker.on('dragend', function (e) {
          var coords = e.target.getLatLng();
          updatePosition(coords.lat, coords.lng);
        });

        map.on('click', function(e) {
          marker.setLatLng(e.latlng);
          updatePosition(e.latlng.lat, e.latlng.lng);
        });

        window.moveToLocation = function(lat, lng) {
          var latlng = new L.LatLng(lat, lng);
          map.setView(latlng, 16);
          marker.setLatLng(latlng);
          updatePosition(lat, lng);
        }
      </script>
    </body>
    </html>
  `;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.root}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f6f6" />
        <ScreenHeader title="New Address" backgroundColor="#f8f6f6" />

        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          <TouchableOpacity 
            style={styles.mapButton} 
            onPress={() => setIsMapVisible(true)}
          >
            <View style={styles.mapButtonIconBox}>
              <MaterialIcons name="my-location" size={24} color="#db1f2f" />
            </View>
            <View>
              <Text style={styles.mapButtonTitle}>Use Map or GPS</Text>
              <Text style={styles.mapButtonSub}>Auto-fill your street and city</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>

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

      {/* Map Modal */}
      <Modal visible={isMapVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalRoot}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsMapVisible(false)} style={styles.modalCloseBtn}>
              <MaterialIcons name="close" size={24} color="#0f172a" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Location</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.mapContainer}>
            <WebView
              ref={webViewRef}
              source={{ html: mapHtml }}
              onMessage={(event) => {
                try {
                  const data = JSON.parse(event.nativeEvent.data);
                  if (data.lat && data.lng) {
                    setSelectedCoords({ lat: data.lat, lng: data.lng });
                  }
                } catch (e) {}
              }}
              style={styles.webview}
              javaScriptEnabled={true}
              scrollEnabled={false}
              bounces={false}
            />

            {/* Floating GPS Button */}
            <TouchableOpacity style={styles.floatingGpsBtn} onPress={handleLocateMe}>
              {mapLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <MaterialIcons name="my-location" size={24} color="#fff" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.modalFooter}>
            <PrimaryButton 
              label={mapLoading ? 'Getting Address...' : "Confirm Location"} 
              onPress={handleConfirmLocation} 
              disabled={mapLoading || !selectedCoords}
            />
          </View>
        </SafeAreaView>
      </Modal>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8f6f6' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 16 },
  
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  mapButtonIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(219,31,47,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  mapButtonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  mapButtonSub: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },

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
  chipSelected: { backgroundColor: '#db1f2f', borderColor: '#db1f2f' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  chipTextSelected: { color: '#FFF' },
  errorText: { fontSize: 12, color: '#db1f2f', marginTop: -8, marginBottom: 12, marginLeft: 4 },

  // Modal Styles
  modalRoot: { flex: 1, backgroundColor: '#fff' },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  floatingGpsBtn: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#fff',
  }
});
