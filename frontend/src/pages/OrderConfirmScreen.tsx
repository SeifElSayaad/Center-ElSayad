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
import { useTranslation } from 'react-i18next';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderConfirm'>;
type RouteParam = RouteProp<RootStackParamList, 'OrderConfirm'>;

export default function OrderConfirmScreen() {
  const { t } = useTranslation();
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
          <Text style={styles.title}>{t('orderConfirm.title')}</Text>
          <Text style={styles.subtitle}>{t('orderConfirm.subtitle')}</Text>

          <View style={styles.orderCard}>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>{t('orderConfirm.orderId')}</Text>
              <Text style={styles.orderIdText}>#{orderId.slice(-8).toUpperCase()}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>{t('orderConfirm.totalPaid')}</Text>
              <Text style={styles.totalText}>EGP {totalAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>{t('orderConfirm.status')}</Text>
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>{t('orderConfirm.pending')}</Text>
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
            <MaterialIcons name="local-shipping" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.trackBtnText}>{t('orderConfirm.trackOrder')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.85}
          >
            <Text style={styles.continueBtnText}>{t('orderConfirm.continueShopping')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8f6f6' },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  iconWrapper: { marginBottom: 32 },
  iconCircle: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: '#db1f2f',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#db1f2f', shadowOpacity: 0.35, shadowRadius: 24, shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  textGroup: { width: '100%', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 12, letterSpacing: -0.5 },
  subtitle: {
    fontSize: 15, color: '#64748b', textAlign: 'center', lineHeight: 24, marginBottom: 32,
    paddingHorizontal: 12,
  },
  orderCard: {
    width: '100%', backgroundColor: '#ffffff', borderRadius: 20,
    padding: 24, marginBottom: 40,
    borderWidth: 1, borderColor: '#f1f5f9',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 16, shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  orderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  orderLabel: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  orderIdText: { fontSize: 15, fontWeight: '700', color: '#0f172a', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  totalText: { fontSize: 18, fontWeight: '800', color: '#db1f2f' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 16 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFFBEB', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F59E0B' },
  statusText: { fontSize: 12, fontWeight: '700', color: '#F59E0B', letterSpacing: 0.5 },
  actions: { width: '100%', gap: 16 },
  trackBtn: {
    backgroundColor: '#db1f2f', height: 56, borderRadius: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#db1f2f', shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  trackBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  continueBtn: {
    height: 56, borderRadius: 16,
    borderWidth: 2, borderColor: '#e2e8f0',
    alignItems: 'center', justifyContent: 'center',
  },
  continueBtnText: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
});
