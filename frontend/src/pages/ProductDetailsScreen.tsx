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
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Static Data ─────────────────────────────────────────────────────────────

const DESCRIPTION =
  'Crafted with premium materials and built to last, this product combines superior quality with elegant design. Perfect for everyday use at the office, school, or home. Each item is carefully inspected to ensure it meets the highest standards of craftsmanship and durability.';

const REVIEWS = [
  {
    id: '1',
    name: 'Ahmed K.',
    date: '2 Days Ago',
    rating: 5,
    comment: 'Excellent quality, exactly what I was looking for. The paper is smooth and ink doesn\'t bleed through.',
  },
  {
    id: '2',
    name: 'Sara M.',
    date: '1 Week Ago',
    rating: 4,
    comment: 'Good product overall, but delivery was a bit slow. Still satisfied with the purchase.',
  }
];

// ─── Types ────────────────────────────────────────────────────────────────────

type RouteProps = RouteProp<RootStackParamList, 'ProductDetails'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductDetails'>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductDetailsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { product } = route.params;

  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedQty, setSelectedQty] = useState(1);

  const incrementQty = () => setSelectedQty(prev => prev + 1);
  const decrementQty = () => setSelectedQty(prev => (prev > 1 ? prev - 1 : 1));

  // Calculate total price
  const totalPrice = (product.retailPrice * selectedQty).toFixed(2);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
        >
          <MaterialIcons name="arrow-back" size={24} color="#212121" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setIsFavorite(v => !v)}
            accessibilityLabel="Toggle Favorite"
          >
            <MaterialIcons
              name={isFavorite ? 'favorite' : 'favorite-border'}
              size={24}
              color={isFavorite ? '#D32F2F' : '#212121'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} accessibilityLabel="Share">
            <MaterialIcons name="share" size={24} color="#212121" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Scrollable Body ── */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Image Container ── */}
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: product.images?.[0]?.url || 'https://placehold.co/400x400?text=No+Image' }}
              style={styles.productImage}
              resizeMode="contain"
            />
            {/* Image Dots */}
            <View style={styles.imageDots}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
              ))}
            </View>
          </View>
        </View>

        {/* ── Product Info ── */}
        <View style={styles.infoSection}>
          <Text style={styles.brandText}>{'PREMIUM COLLECTION'}</Text>
          
          <View style={styles.titleRow}>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={styles.inStockBadge}>
              <Text style={styles.inStockText}>IN STOCK</Text>
            </View>
          </View>

          {/* Rating */}
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <MaterialIcons
                key={star}
                name={star <= 4 ? 'star' : 'star-half'}
                size={18}
                color="#D32F2F"
              />
            ))}
            <Text style={styles.ratingText}>4.5</Text>
            <Text style={styles.reviewCount}>(128 reviews)</Text>
          </View>

          <View style={styles.divider} />

          {/* Price & Quantity */}
          <View style={styles.priceQtyRow}>
            <View>
              <Text style={styles.totalPriceLabel}>TOTAL PRICE</Text>
              <Text style={styles.price}>${totalPrice}</Text>
            </View>
            
            <View style={styles.qtyControl}>
              <TouchableOpacity style={styles.qtyBtn} onPress={decrementQty}>
                <MaterialIcons name="remove" size={20} color="#212121" />
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{selectedQty}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={incrementQty}>
                <MaterialIcons name="add" size={20} color="#212121" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Description ── */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Description</Text>
          <Text style={styles.descriptionText}>{DESCRIPTION}</Text>
        </View>

        {/* ── Attributes Row ── */}
        <View style={styles.attributesRow}>
          <View style={styles.attributeCard}>
            <MaterialIcons name="category" size={24} color="#D32F2F" style={styles.attrIcon} />
            <Text style={styles.attrLabel}>CATEGORY</Text>
            <Text style={styles.attrValue}>Stationery</Text>
          </View>
        </View> 

        {/* ── User Reviews ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>User Reviews</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {REVIEWS.map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <View style={styles.reviewAvatar}>
                <Text style={styles.reviewAvatarText}>{review.name.charAt(0)}</Text>
              </View>
              <View style={styles.reviewContent}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewName}>{review.name}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
                <View style={styles.reviewStars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <MaterialIcons
                      key={star}
                      name={star <= review.rating ? 'star' : 'star-border'}
                      size={14}
                      color="#D32F2F"
                    />
                  ))}
                </View>
                <Text style={styles.reviewText}>{review.comment}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Bottom spacer for the sticky footer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Sticky Bottom Action ── */}
      <View style={styles.bottomBar}>
        <View style={styles.cartInfo}>
          <Text style={styles.cartTotalLabel}>Total</Text>
          <Text style={styles.cartTotalPrice}>${totalPrice}</Text>
        </View>
        <TouchableOpacity style={styles.addToCartBtn}>
          <MaterialIcons name="shopping-cart" size={20} color="#FFFFFF" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 8 : 52,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerLogo: {
    height: 30,
    width: 120,
  },
  headerRight: {
    flexDirection: 'row',
  },
  scrollView: { 
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  scrollContent: { 
    paddingBottom: 24,
  },
  // Image
  imageContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  imageWrapper: {
    width: SCREEN_WIDTH - 40,
    aspectRatio: 1,
    backgroundColor: '#F8F8F8',
    alignSelf: 'center',
    borderRadius: 20,
    marginTop: 10,
    padding: 20,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imageDots: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D1D6',
  },
  dotActive: {
    width: 20,
    backgroundColor: '#D32F2F',
  },
  // Info Section
  infoSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    padding: 24,
    borderRadius: 24,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  brandText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D32F2F',
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  productName: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: '#212121',
    lineHeight: 28,
  },
  inStockBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  inStockText: {
    color: '#4CAF50',
    fontSize: 10,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#212121',
    marginLeft: 6,
  },
  reviewCount: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 20,
  },
  // Price & Qty
  priceQtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalPriceLabel: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: '800',
    color: '#D32F2F',
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  qtyBtn: {
    padding: 10,
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    width: 30,
    textAlign: 'center',
  },
  // Shared Section
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 12,
  },
  seeAllText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 15,
    color: '#757575',
    lineHeight: 24,
  },
  // Attributes
  attributesRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 24,
    gap: 12,
  },
  attributeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  attrIcon: {
    marginBottom: 12,
    backgroundColor: '#FFF0F0',
    padding: 8,
    borderRadius: 8,
  },
  attrLabel: {
    fontSize: 11,
    color: '#757575',
    fontWeight: '600',
    marginBottom: 4,
  },
  attrValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212121',
  },
  // Reviews
  reviewItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reviewAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#757575',
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212121',
  },
  reviewDate: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  reviewStars: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 20,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },
  cartInfo: {
    flex: 1,
  },
  cartTotalLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 2,
  },
  cartTotalPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: '#212121',
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D32F2F',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
