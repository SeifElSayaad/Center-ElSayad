import React from 'react';
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
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ScreenHeader from '../components/ScreenHeader';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CustomerOrder'>;

export default function CustomerOrderScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F7" />
      
      <ScreenHeader title="Order Details" backgroundColor="#F5F5F5" />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        
        {/* ── Order Header ── */}
        <View style={styles.orderIdentBlock}>
          <View>
            <Text style={styles.orderId}>#ORD-10924</Text>
            <Text style={styles.orderDate}>Placed on Oct 24, 2026</Text>
          </View>
          <View style={styles.statusBadge}>
            <MaterialIcons name="check-circle" size={12} color="#2E7D32" />
            <Text style={styles.statusText}>DELIVERED</Text>
          </View>
        </View>

        {/* ── Items List ── */}
        <Text style={styles.sectionTitle}>ITEMS (3)</Text>
        <View style={styles.itemsCard}>
          {[1, 2, 3].map((item, idx) => (
            <View key={item}>
              <View style={styles.itemRow}>
                <Image 
                  source={{ uri: `https://via.placeholder.com/100/f3f4f6/9ca3af?text=Item+${item}` }} 
                  style={styles.itemImage} 
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName} numberOfLines={2}>Product Name Placeholder {item}</Text>
                  <Text style={styles.itemMeta}>Size: A5 • Qty: 1</Text>
                </View>
                <Text style={styles.itemPrice}>$45.00</Text>
              </View>
              {idx < 2 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* ── Shipping Address ── */}
        <Text style={styles.sectionTitle}>SHIPPING ADDRESS</Text>
        <View style={styles.addressCard}>
          <View style={styles.markerBox}>
            <MaterialIcons name="place" size={24} color="#D32F2F" />
          </View>
          <View style={styles.addressInfo}>
            <Text style={styles.recipientName}>Ahmed El Sayad</Text>
            <Text style={styles.addressLine}>123 Main Street, Appt 4B</Text>
            <Text style={styles.addressLine}>Cairo, Egypt 11511</Text>
            <Text style={styles.addressLine}>+20 100 123 4567</Text>
          </View>
        </View>

        {/* ── Order Summary ── */}
        <Text style={styles.sectionTitle}>ORDER SUMMARY</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>$135.00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.freeHighlight}>Free</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taxes</Text>
            <Text style={styles.summaryValue}>$14.00</Text>
          </View>
          <View style={styles.dividerBold} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalValue}>$149.00</Text>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ── Fixed Footer Action ── */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.reorderBtn}>
          <Text style={styles.reorderBtnText}>Reorder Items</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 8 : 52,
    paddingBottom: 16,
    backgroundColor: '#F5F5F5',
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
  content: {
    paddingHorizontal: 16,
    paddingBottom: 100, // accommodate bottom nav
  },
  orderIdentBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  orderId: {
    fontSize: 20,
    fontWeight: '800',
    color: '#212121',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 13,
    color: '#757575',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    color: '#2E7D32',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#757575',
    marginBottom: 12,
    letterSpacing: 0.5,
    marginTop: 8,
  },
  itemsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#D32F2F',
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 16,
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  markerBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  addressInfo: {
    flex: 1,
  },
  recipientName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  addressLine: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 8,
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
    color: '#212121',
    fontWeight: '500',
  },
  freeHighlight: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
  },
  dividerBold: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#D32F2F',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  reorderBtn: {
    backgroundColor: '#D32F2F',
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D32F2F',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  reorderBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
