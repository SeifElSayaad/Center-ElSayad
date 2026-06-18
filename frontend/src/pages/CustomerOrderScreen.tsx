import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ScreenHeader from '../components/ScreenHeader';
import { getOrderById, Order } from '../services/orderApi';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CustomerOrder'>;
type RouteParam = RouteProp<RootStackParamList, 'CustomerOrder'>;

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: any }> = {
  PENDING:    { color: '#F59E0B', bg: '#FFF8E1', icon: 'schedule' },
  PROCESSING: { color: '#2196F3', bg: '#E3F2FD', icon: 'autorenew' },
  SHIPPED:    { color: '#7C3AED', bg: '#F3E8FF', icon: 'local-shipping' },
  DELIVERED:  { color: '#2E7D32', bg: '#E8F5E9', icon: 'check-circle' },
  CANCELLED:  { color: '#D32F2F', bg: '#FFF0F0', icon: 'cancel' },
};

export default function CustomerOrderScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteParam>();
  const { orderId } = route.params;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
        
        // Stop polling if order has reached a terminal state
        if (data.status === 'DELIVERED' || data.status === 'CANCELLED') {
          if (intervalId) clearInterval(intervalId);
        }
      } catch (err: any) {
        setError(err?.response?.data?.error ?? err?.message ?? 'Failed to load order');
        if (intervalId) clearInterval(intervalId); // Stop polling on error
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchOrder();

    // Poll every 10 seconds
    intervalId = setInterval(fetchOrder, 10000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [orderId]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const statusCfg = order ? (STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING) : STATUS_CONFIG.PENDING;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <ScreenHeader title="Order Details" backgroundColor="#F5F5F5" />

      {loading ? (
        <ActivityIndicator color="#D32F2F" style={{ marginTop: 60 }} size="large" />
      ) : error ? (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#E5E7EB" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.retryBtn}>
            <Text style={styles.retryBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : order ? (
        <>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
            {/* ── Order Header ── */}
            <View style={styles.orderIdentBlock}>
              <View>
                <Text style={styles.orderId}>#{order.id.slice(-8).toUpperCase()}</Text>
                <Text style={styles.orderDate}>Placed on {formatDate(order.createdAt)}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
                <MaterialIcons name={statusCfg.icon} size={13} color={statusCfg.color} />
                <Text style={[styles.statusText, { color: statusCfg.color }]}>{order.status}</Text>
              </View>
            </View>

            {/* ── Items List ── */}
            <Text style={styles.sectionTitle}>ITEMS ({order.items.length})</Text>
            <View style={styles.itemsCard}>
              {order.items.map((item, idx) => (
                <View key={item.id}>
                  <View style={styles.itemRow}>
                    <View style={styles.itemImagePlaceholder}>
                      <MaterialIcons name="shopping-bag" size={20} color="#D32F2F" />
                    </View>
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName} numberOfLines={2}>{item.productName}</Text>
                      <Text style={styles.itemMeta}>Qty: {item.quantity}</Text>
                    </View>
                    <Text style={styles.itemPrice}>EGP {item.totalPrice.toFixed(2)}</Text>
                  </View>
                  {idx < order.items.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>

            {/* ── Shipping Address ── */}
            {order.address && (
              <>
                <Text style={styles.sectionTitle}>SHIPPING ADDRESS</Text>
                <View style={styles.addressCard}>
                  <View style={styles.markerBox}>
                    <MaterialIcons name="place" size={24} color="#D32F2F" />
                  </View>
                  <View style={styles.addressInfo}>
                    <Text style={styles.recipientName}>{order.address.fullName}</Text>
                    <Text style={styles.addressLine}>{order.address.street}</Text>
                    <Text style={styles.addressLine}>{order.address.city}, {order.address.country}</Text>
                    <Text style={styles.addressLine}>{order.address.phone}</Text>
                  </View>
                </View>
              </>
            )}

            {/* ── Order Summary ── */}
            <Text style={styles.sectionTitle}>ORDER SUMMARY</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>EGP {order.subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.freeHighlight}>
                  {order.shippingAmount === 0 ? 'Free' : `EGP ${order.shippingAmount.toFixed(2)}`}
                </Text>
              </View>
              {order.taxAmount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Taxes</Text>
                  <Text style={styles.summaryValue}>EGP {order.taxAmount.toFixed(2)}</Text>
                </View>
              )}
              <View style={styles.dividerBold} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total Paid</Text>
                <Text style={styles.totalValue}>EGP {order.totalAmount.toFixed(2)}</Text>
              </View>
            </View>

            {/* ── Payment info ── */}
            <Text style={styles.sectionTitle}>PAYMENT</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Method</Text>
                <Text style={styles.summaryValue}>
                  {order.paymentMethod === 'CASH_ON_DELIVERY' ? 'Cash on Delivery' : 'Card (Mock)'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Status</Text>
                <Text style={[styles.summaryValue, { color: order.paymentStatus === 'PAID' ? '#2E7D32' : '#F59E0B' }]}>
                  {order.paymentStatus}
                </Text>
              </View>
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>

          {/* ── Fixed Footer ── */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.reorderBtn} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.reorderBtnText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F5F5' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 100 },
  orderIdentBlock: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 24, marginTop: 16,
  },
  orderId: { fontSize: 20, fontWeight: '800', color: '#212121', marginBottom: 4 },
  orderDate: { fontSize: 13, color: '#757575' },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, gap: 4,
  },
  statusText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  sectionTitle: {
    fontSize: 13, fontWeight: '700', color: '#757575',
    marginBottom: 12, letterSpacing: 0.5, marginTop: 8,
  },
  itemsCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 24,
    shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  itemRow: { flexDirection: 'row', alignItems: 'center' },
  itemImagePlaceholder: {
    width: 56, height: 56, borderRadius: 10,
    backgroundColor: '#FFF0F0', alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#212121', marginBottom: 4 },
  itemMeta: { fontSize: 12, color: '#9CA3AF' },
  itemPrice: { fontSize: 15, fontWeight: '700', color: '#D32F2F', marginLeft: 12 },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 16 },
  addressCard: {
    flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 24,
    shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  markerBox: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF0F0',
    alignItems: 'center', justifyContent: 'center', marginRight: 16,
  },
  addressInfo: { flex: 1 },
  recipientName: { fontSize: 15, fontWeight: '700', color: '#212121', marginBottom: 4 },
  addressLine: { fontSize: 13, color: '#6B7280', lineHeight: 20 },
  summaryCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 24,
    shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: '#6B7280' },
  summaryValue: { fontSize: 14, color: '#212121', fontWeight: '500' },
  freeHighlight: { fontSize: 14, color: '#2E7D32', fontWeight: '600' },
  dividerBold: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#212121' },
  totalValue: { fontSize: 18, fontWeight: '800', color: '#D32F2F' },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32,
    borderTopWidth: 1, borderTopColor: '#EEEEEE',
  },
  reorderBtn: {
    backgroundColor: '#D32F2F', height: 54, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#D32F2F', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  reorderBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  errorText: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
  retryBtn: {
    marginTop: 8, paddingHorizontal: 24, paddingVertical: 12,
    backgroundColor: '#D32F2F', borderRadius: 12,
  },
  retryBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
});
