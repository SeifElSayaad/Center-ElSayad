import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import BottomNav from '../components/BottomNav';
import ScreenHeader from '../components/ScreenHeader';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Cart'>;

const INITIAL_CART = [
  {
    id: '1',
    name: 'Premium Hardcover Notebook, A5 Black',
    brand: 'CENTER ELSAYAD',
    price: 18.99,
    qty: 1,
    image: 'https://via.placeholder.com/150/f3f4f6/9ca3af?text=Notebook',
  },
  {
    id: '2',
    name: 'Gel Pen Set, 12 Colors Fine Point',
    brand: 'CENTER ELSAYAD',
    price: 12.50,
    qty: 2,
    image: 'https://via.placeholder.com/150/f3f4f6/9ca3af?text=Pens',
  },
];

export default function CartScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [cartItems, setCartItems] = useState(INITIAL_CART);

  const incrementQty = (id: string) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item));
  };

  const decrementQty = (id: string) => {
    setCartItems(prev => prev.map(item => item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = subtotal > 0 ? 5.00 : 0;
  const total = subtotal + shipping;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F7" />
      
      <ScreenHeader title="My Cart" backgroundColor="#F5F5F7" />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ── Cart Items ── */}
        <View style={styles.itemsContainer}>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartCard}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              
              <View style={styles.itemDetails}>
                <Text style={styles.brandText}>{item.brand}</Text>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                
                <View style={styles.qtyContainer}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => decrementQty(item.id)}>
                    <MaterialIcons name="remove" size={16} color="#4B5563" />
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{item.qty}</Text>
                  <TouchableOpacity style={[styles.qtyBtn, styles.qtyBtnPlus]} onPress={() => incrementQty(item.id)}>
                    <MaterialIcons name="add" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.deleteBtn} onPress={() => removeItem(item.id)}>
                <Feather name="trash-2" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          ))}
          {cartItems.length === 0 && (
            <Text style={styles.emptyText}>Your cart is empty.</Text>
          )}
        </View>

        {/* ── Summary ── */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Price</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>

          <TouchableOpacity style={styles.checkoutBtn}>
            <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
            <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ── Bottom Nav ── */}
      <BottomNav activeTab="Favorites" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 8 : 52,
    paddingBottom: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100, // accommodate bottom nav
  },
  itemsContainer: {
    marginBottom: 24,
  },
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
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 10,
    color: '#D32F2F',
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#212121',
    lineHeight: 20,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#212121',
    marginBottom: 12,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnPlus: {
    backgroundColor: '#D32F2F',
  },
  qtyValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#212121',
    width: 32,
    textAlign: 'center',
  },
  deleteBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 40,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#D32F2F',
  },
  checkoutBtn: {
    backgroundColor: '#D32F2F',
    flexDirection: 'row',
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#D32F2F',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
