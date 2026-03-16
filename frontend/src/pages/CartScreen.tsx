import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import BottomNav from '../components/BottomNav';
import ScreenHeader from '../components/ScreenHeader';
import { useCartStore } from '../store/cartStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Cart'>;

export default function CartScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { items, updateQuantity, removeItem, subtotal } = useCartStore();

  const sub = subtotal();
  const shipping = 0; // Free shipping
  const total = sub + shipping;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F7" />
      <ScreenHeader title="My Cart" backgroundColor="#F5F5F7" />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ── Cart Items ── */}
        <View style={styles.itemsContainer}>
          {items.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="shopping-cart" size={56} color="#E5E7EB" />
              <Text style={styles.emptyTitle}>Your cart is empty</Text>
              <Text style={styles.emptySubText}>Add products from the home screen to get started</Text>
              <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.shopBtnText}>Start Shopping</Text>
              </TouchableOpacity>
            </View>
          ) : (
            items.map((item) => (
              <View key={item.productId} style={styles.cartCard}>
                {item.imageUrl ? (
                  <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
                ) : (
                  <View style={[styles.itemImage, styles.imagePlaceholder]}>
                    <MaterialIcons name="image" size={28} color="#D1D5DB" />
                  </View>
                )}

                <View style={styles.itemDetails}>
                  <Text style={styles.brandText}>CENTER ELSAYAD</Text>
                  <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.itemPrice}>EGP {item.price.toFixed(2)}</Text>

                  <View style={styles.qtyContainer}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                      <MaterialIcons name="remove" size={16} color="#4B5563" />
                    </TouchableOpacity>
                    <Text style={styles.qtyValue}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={[styles.qtyBtn, styles.qtyBtnPlus]}
                      onPress={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      <MaterialIcons name="add" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity style={styles.deleteBtn} onPress={() => removeItem(item.productId)}>
                  <Feather name="trash-2" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* ── Summary ── */}
        {items.length > 0 && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>EGP {sub.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={[styles.summaryValue, { color: '#2E7D32' }]}>Free</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total Price</Text>
              <Text style={styles.totalValue}>EGP {total.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => navigation.navigate('Checkout')}
              activeOpacity={0.85}
            >
              <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
              <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ── Bottom Nav ── */}
      <BottomNav activeTab="Favorites" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F5F7' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },
  itemsContainer: { marginBottom: 24 },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    position: 'relative',
  },
  itemImage: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#F3F4F6' },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  itemDetails: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  brandText: { fontSize: 10, color: '#D32F2F', fontWeight: '700', letterSpacing: 0.5, marginBottom: 4 },
  itemName: { fontSize: 14, fontWeight: '700', color: '#212121', lineHeight: 20, marginBottom: 4 },
  itemPrice: { fontSize: 16, fontWeight: '800', color: '#212121', marginBottom: 12 },
  qtyContainer: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnPlus: { backgroundColor: '#D32F2F' },
  qtyValue: { fontSize: 14, fontWeight: '700', color: '#212121', width: 32, textAlign: 'center' },
  deleteBtn: { position: 'absolute', top: 12, right: 12, width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 60, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#374151', marginTop: 8 },
  emptySubText: { fontSize: 13, color: '#9CA3AF', textAlign: 'center', paddingHorizontal: 16 },
  shopBtn: {
    marginTop: 16, paddingHorizontal: 24, paddingVertical: 12,
    backgroundColor: '#D32F2F', borderRadius: 12,
  },
  shopBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: '#6B7280' },
  summaryValue: { fontSize: 14, fontWeight: '600', color: '#212121' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 12 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#212121' },
  totalValue: { fontSize: 22, fontWeight: '800', color: '#D32F2F' },
  checkoutBtn: {
    backgroundColor: '#D32F2F', flexDirection: 'row', height: 54, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginTop: 20,
    shadowColor: '#D32F2F', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  checkoutBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
