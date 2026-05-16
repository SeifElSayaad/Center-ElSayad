import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
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
import { getUserOrders, Order, OrderStatus } from '../services/orderApi';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderHistory'>;

// ─── Status badge config ──────────────────────────────────────────────────────
// Maps each status to a color and icon so each order row is visually distinct.

const STATUS_CONFIG: Record<OrderStatus, { color: string; bg: string; icon: any; label: string }> = {
  PENDING:    { color: '#F59E0B', bg: '#FFF8E1', icon: 'schedule',       label: 'Pending' },
  PROCESSING: { color: '#2196F3', bg: '#E3F2FD', icon: 'autorenew',      label: 'Processing' },
  SHIPPED:    { color: '#7C3AED', bg: '#F3E8FF', icon: 'local-shipping',  label: 'Shipped' },
  DELIVERED:  { color: '#2E7D32', bg: '#E8F5E9', icon: 'check-circle',   label: 'Delivered' },
  CANCELLED:  { color: '#D32F2F', bg: '#FFF0F0', icon: 'cancel',         label: 'Cancelled' },
};

// ─── Single Order Row ─────────────────────────────────────────────────────────

function OrderCard({ order, onPress }: { order: Order; onPress: () => void }) {
  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;
  const date = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Order ID + Date */}
      <View style={styles.cardTop}>
        <View>
          <Text style={styles.orderId}>#{order.id.slice(-8).toUpperCase()}</Text>
          <Text style={styles.orderDate}>{date}</Text>
        </View>
        {/* Status badge */}
        <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
          <MaterialIcons name={cfg.icon} size={12} color={cfg.color} />
          <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
      </View>

      {/* Item count + Total */}
      <View style={styles.cardBottom}>
        <Text style={styles.itemCount}>
          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
        </Text>
        <Text style={styles.total}>EGP {order.totalAmount.toFixed(2)}</Text>
      </View>

      {/* Chevron hint */}
      <MaterialIcons name="chevron-right" size={20} color="#94a3b8" style={styles.chevron} />
    </TouchableOpacity>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyOrders({ onShop }: { onShop: () => void }) {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconBox}>
        <MaterialIcons name="shopping-bag" size={48} color="#db1f2f" />
      </View>
      <Text style={styles.emptyTitle}>No orders yet</Text>
      <Text style={styles.emptySubtitle}>
        When you place an order, it will appear here so you can track it.
      </Text>
      <TouchableOpacity style={styles.shopBtn} onPress={onShop}>
        <Text style={styles.shopBtnText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function OrderHistoryScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getUserOrders();
        // Show newest orders first
        setOrders(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (err: any) {
        setError(err?.response?.data?.message ?? 'Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f6f6" />
      <ScreenHeader title="My Orders" />

      {loading ? (
        <ActivityIndicator color="#db1f2f" size="large" style={styles.loader} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#e2e8f0" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => { setError(null); setLoading(true); }}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={orders.length === 0 ? styles.flatListEmpty : styles.flatListContent}
          ListEmptyComponent={<EmptyOrders onShop={() => navigation.navigate('Home')} />}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() => navigation.navigate('CustomerOrder', { orderId: item.id })}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8f6f6' },
  loader: { marginTop: 80 },

  // List
  flatListContent: { padding: 16, paddingBottom: 40 },
  flatListEmpty: { flex: 1 },

  // Order card
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  orderDate: { fontSize: 12, color: '#64748b', marginTop: 2 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: { fontSize: 11, fontWeight: '700' },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  itemCount: { fontSize: 13, color: '#64748b' },
  total: { fontSize: 16, fontWeight: '700', color: '#db1f2f' },
  chevron: { position: 'absolute', right: 16, top: '50%' },

  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIconBox: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#fff1f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  shopBtn: {
    backgroundColor: '#db1f2f',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  shopBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  // Error state
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  errorText: { fontSize: 14, color: '#64748b', textAlign: 'center' },
  retryBtn: {
    marginTop: 8, backgroundColor: '#db1f2f',
    paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12,
  },
  retryText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
