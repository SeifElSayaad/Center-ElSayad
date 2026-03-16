import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderConfirm'>;
type RouteParam = RouteProp<RootStackParamList, 'OrderConfirm'>;

export default function OrderConfirmScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteParam>();
  const { orderId, totalAmount } = route.params;

  // Animations
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 10, stiffness: 150 }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      <View style={styles.container}>
        {/* Animated checkmark circle */}
        <Animated.View style={[styles.iconWrapper, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="check" size={52} color="#FFF" />
          </View>
        </Animated.View>

        <Animated.View style={[styles.textGroup, { opacity: fadeAnim }]}>
          <Text style={styles.title}>Order Placed!</Text>
          <Text style={styles.subtitle}>Your order has been successfully placed and is being processed.</Text>

          <View style={styles.orderCard}>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Order ID</Text>
              <Text style={styles.orderIdText}>#{orderId.slice(-8).toUpperCase()}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Total Paid</Text>
              <Text style={styles.totalText}>EGP {totalAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Status</Text>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>PENDING</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.actions, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.trackBtn}
            onPress={() => navigation.replace('CustomerOrder', { orderId })}
            activeOpacity={0.85}
          >
            <MaterialIcons name="local-shipping" size={18} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.trackBtnText}>Track Order</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.85}
          >
            <Text style={styles.continueBtnText}>Continue Shopping</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF' },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  iconWrapper: { marginBottom: 28 },
  iconCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#D32F2F',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#D32F2F', shadowOpacity: 0.35, shadowRadius: 20, shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  textGroup: { width: '100%', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 8 },
  subtitle: {
    fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22, marginBottom: 28,
  },
  orderCard: {
    width: '100%', backgroundColor: '#F9FAFB', borderRadius: 16,
    padding: 20, marginBottom: 32,
    borderWidth: 1, borderColor: '#F3F4F6',
  },
  orderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  orderLabel: { fontSize: 13, color: '#9CA3AF' },
  orderIdText: { fontSize: 14, fontWeight: '700', color: '#1F2937', fontFamily: 'monospace' },
  totalText: { fontSize: 15, fontWeight: '800', color: '#D32F2F' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 8 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F59E0B' },
  statusText: { fontSize: 12, fontWeight: '700', color: '#F59E0B' },
  actions: { width: '100%', gap: 12 },
  trackBtn: {
    backgroundColor: '#D32F2F', height: 54, borderRadius: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#D32F2F', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  trackBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  continueBtn: {
    height: 54, borderRadius: 14,
    borderWidth: 1.5, borderColor: '#E5E7EB',
    alignItems: 'center', justifyContent: 'center',
  },
  continueBtnText: { fontSize: 15, fontWeight: '600', color: '#374151' },
});
