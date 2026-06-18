import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ScreenHeader from '../components/ScreenHeader';
import { useCartStore } from '../store/cartStore';
import { useAddressStore } from '../store/addressStore';
import { placeOrder, PaymentMethod } from '../services/orderApi';
import { useTranslation } from 'react-i18next';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Checkout'>;

export default function CheckoutScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const { items, subtotal, clearCart } = useCartStore();
  const { addresses, selectedAddressId, fetchAddresses, isLoading: addressLoading } = useAddressStore();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH_ON_DELIVERY');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? null;

  const sub = subtotal();
  const shipping = sub > 0 ? 0 : 0; // Free shipping for now
  const total = sub + shipping;

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert(t('checkout.noAddressTitle'), t('checkout.noAddress'));
      return;
    }
    if (items.length === 0) {
      Alert.alert(t('checkout.emptyCartTitle'), t('checkout.emptyCart'));
      return;
    }

    setPlacing(true);
    try {
      const order = await placeOrder({
        addressId: selectedAddress.id,
        paymentMethod,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      clearCart();
      navigation.replace('OrderConfirm', { orderId: order.id, totalAmount: order.totalAmount });
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? err?.message ?? t('checkout.orderFailedMessage');
      Alert.alert(t('checkout.orderFailed'), msg);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F7" />
      <ScreenHeader title={t('checkout.title')} backgroundColor="#F5F5F7" />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Items Summary ── */}
        <Text style={styles.sectionLabel}>{t('checkout.yourItems', { count: items.length })}</Text>
        <View style={styles.card}>
          {items.map((item, idx) => (
            <View key={item.productId}>
              <View style={styles.itemRow}>
                {item.imageUrl ? (
                  <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
                ) : (
                  <View style={[styles.itemImage, styles.imagePlaceholder]}>
                    <MaterialIcons name="shopping-bag" size={20} color="#D32F2F" />
                  </View>
                )}
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.itemMeta}>{t('checkout.qty')}: {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>EGP {(item.price * item.quantity).toFixed(2)}</Text>
              </View>
              {idx < items.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* ── Delivery Address ── */}
        <Text style={styles.sectionLabel}>{t('checkout.deliveryAddress')}</Text>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Address')}
          activeOpacity={0.8}
        >
          {addressLoading ? (
            <ActivityIndicator color="#D32F2F" />
          ) : selectedAddress ? (
            <View style={styles.addressRow}>
              <View style={styles.addressIcon}>
                <MaterialIcons name="place" size={22} color="#D32F2F" />
              </View>
              <View style={styles.addressInfo}>
                <Text style={styles.addressName}>{selectedAddress.fullName}</Text>
                <Text style={styles.addressLine}>{selectedAddress.street}</Text>
                <Text style={styles.addressLine}>{selectedAddress.city}, {selectedAddress.country}</Text>
                <Text style={styles.addressLine}>{selectedAddress.phone}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
            </View>
          ) : (
            <View style={styles.addressRow}>
              <View style={styles.addressIcon}>
                <MaterialIcons name="add-location-alt" size={22} color="#D32F2F" />
              </View>
              <Text style={styles.addAddressText}>{t('checkout.addDeliveryAddress')}</Text>
              <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
            </View>
          )}
        </TouchableOpacity>

        {/* ── Payment Method ── */}
        <Text style={styles.sectionLabel}>{t('checkout.paymentMethod')}</Text>
        <View style={styles.card}>
          {(['CASH_ON_DELIVERY', 'MOCK_PAYMENT'] as PaymentMethod[]).map((method) => (
            <TouchableOpacity
              key={method}
              style={styles.paymentRow}
              onPress={() => setPaymentMethod(method)}
              activeOpacity={0.8}
            >
              <View style={styles.paymentLeft}>
                <MaterialIcons
                  name={method === 'CASH_ON_DELIVERY' ? 'payments' : 'credit-card'}
                  size={22}
                  color="#D32F2F"
                />
                <Text style={styles.paymentLabel}>
                  {method === 'CASH_ON_DELIVERY' ? t('checkout.cashOnDelivery') : t('checkout.mockPayment')}
                </Text>
              </View>
              <View style={[styles.radio, paymentMethod === method && styles.radioSelected]}>
                {paymentMethod === method && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Price Breakdown ── */}
        <Text style={styles.sectionLabel}>{t('checkout.orderSummary')}</Text>
        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('checkout.subtotal')}</Text>
            <Text style={styles.summaryValue}>EGP {sub.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('checkout.deliveryFee')}</Text>
            <Text style={[styles.summaryValue, { color: '#2E7D32' }]}>{t('checkout.free')}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>{t('checkout.total')}</Text>
            <Text style={styles.totalValue}>EGP {total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ── Fixed Footer ── */}
      <View style={styles.footer}>
        <View style={styles.footerTotal}>
          <Text style={styles.footerTotalLabel}>{t('checkout.total')}</Text>
          <Text style={styles.footerTotalValue}>EGP {total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.placeOrderBtn, placing && styles.btnDisabled]}
          onPress={handlePlaceOrder}
          disabled={placing}
          activeOpacity={0.85}
        >
          {placing ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <>
              <MaterialIcons name="check-circle" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.placeOrderBtnText}>{t('checkout.placeOrder')}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F5F7' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 16 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  itemRow: { flexDirection: 'row', alignItems: 'center' },
  itemImage: { width: 56, height: 56, borderRadius: 10, backgroundColor: '#F3F4F6' },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  itemDetails: { flex: 1, marginHorizontal: 12 },
  itemName: { fontSize: 13, fontWeight: '600', color: '#1F2937', lineHeight: 18, marginBottom: 4 },
  itemMeta: { fontSize: 12, color: '#9CA3AF' },
  itemPrice: { fontSize: 14, fontWeight: '700', color: '#D32F2F' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 12 },
  addressRow: { flexDirection: 'row', alignItems: 'center' },
  addressIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#FFF0F0', alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  addressInfo: { flex: 1 },
  addressName: { fontSize: 14, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
  addressLine: { fontSize: 12, color: '#6B7280', lineHeight: 18 },
  addAddressText: { flex: 1, fontSize: 14, color: '#D32F2F', fontWeight: '600' },
  paymentRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 10,
  },
  paymentLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  paymentLabel: { fontSize: 14, fontWeight: '500', color: '#1F2937' },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: '#D1D5DB',
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: { borderColor: '#D32F2F' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#D32F2F' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: '#6B7280' },
  summaryValue: { fontSize: 14, fontWeight: '500', color: '#1F2937' },
  separator: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 10 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  totalValue: { fontSize: 18, fontWeight: '800', color: '#D32F2F' },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32,
    borderTopWidth: 1, borderTopColor: '#F3F4F6',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: -4 },
    elevation: 8,
    flexDirection: 'row', alignItems: 'center', gap: 16,
  },
  footerTotal: { flex: 1 },
  footerTotalLabel: { fontSize: 12, color: '#9CA3AF' },
  footerTotalValue: { fontSize: 18, fontWeight: '800', color: '#D32F2F' },
  placeOrderBtn: {
    flex: 2, backgroundColor: '#D32F2F', height: 52, borderRadius: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#D32F2F', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  btnDisabled: { opacity: 0.6 },
  placeOrderBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});
