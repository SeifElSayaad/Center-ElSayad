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
import ProductCard, { Product } from '../components/ProductCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Static Data ─────────────────────────────────────────────────────────────

const RELATED_PRODUCTS: Product[] = [
  {
    id: 'r1',
    name: 'Hard Cover Classic Notebook - L',
    brand: 'MOLESKINE',
    price: '$22.50',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuANHTvG-Sla_vBnsGx2ClDeDAGGqK38AUxPh_zb36qKKpmtQ3FqM2LjThBxXqhILVTIQOGBgDBzt1LGcRu4wYoix0rwKaIaLgi_7stEy2qhdKPyN3ltEGTGG5CJni8NiJH97UYRvJ1z6ESKQESM4omfaVbxHe9_UCDtjcpvQ6bLgArCUXxLkg1-0bH-8C1NGTm0UimRj_zVoQdhCPWTa8nzLmGyvrnySCPsStVqdkQ--cqAx3KuYasvOuY4uw1Uixvtxu1FQNunas',
  },
  {
    id: 'r2',
    name: 'Gel Pen Set, 12 Colors Fine Point',
    brand: 'ARTMATE',
    price: '$12.50',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCV4ZA4kw3-vwhsIfrvMJHbMFOa-kaxrZXJIN6KfG1JI2DWyrfZDNeJW-TJEMh2JkOPT2XJg4ULupZJaaf8QEvADXsAzhgP6kld3KEJygMZMVxDh2tfPm2aAB0gR_cK5exz05fchQKI8yQcGS8N6gS-WQHYr5gK_KUT8sv7vtLo2cm3zp3YvOz7-C_vPVXDcKDGN5AdED2kQHIWVlwKiBzT7QR6hoW8O_WI2KfEN5wiOLjRtpJU4r_Fhzf4H2qmC7CxbTtRscK9RlA',
  },
  {
    id: 'r3',
    name: 'Mesh Desk Organizer Set, Silver',
    brand: 'OFFICEPRO',
    price: '$24.99',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDLwCvxkNVQ_jbvzYvYfLJWuwfrYFZK18oj5ZJi-jRh3WbcyGehmQlh_E8egvu7ehIxlr85S_mes-r-UAwrkKsDCiI6Zh41e6T1B5u8UKX9U177JexsVNhbTym5GplxOhiVHOMbJ0-aslY-D3hvxQ7OL3WKmC63e1rc2d0968Ex3pMxuJupcXeOtPsflSaP2T3Vai1IGN61eJgbqX8Fu6dtPqsegcue2gJGR-oxztLF1H66ixfBOqE_HhbSsCLk4uL9le7RyHGyv5E',
  },
];

const QUANTITIES = [1, 2, 3, 5, 10];

const DESCRIPTION =
  'Crafted with premium materials and built to last, this product combines superior quality with elegant design. Perfect for everyday use at the office, school, or home. Each item is carefully inspected to ensure it meets the highest standards of craftsmanship and durability. Whether you are stocking up for a new semester, refreshing your workspace, or looking for the perfect gift, this is the definitive choice.';

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
  const [descExpanded, setDescExpanded] = useState(false);

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
          <MaterialIcons name="arrow-back" size={24} color="#1b0e0f" />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {product.name}
        </Text>

        <TouchableOpacity style={styles.iconBtn} accessibilityLabel="View cart">
          <MaterialIcons name="shopping-cart" size={24} color="#1b0e0f" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* ── Scrollable Body ── */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Image Container ── */}
        <View style={styles.imageWrapper}>
          {product.sale && (
            <View style={styles.saleBadge}>
              <Text style={styles.saleBadgeText}>SALE</Text>
            </View>
          )}
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
          {/* Favorite Button */}
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={() => setIsFavorite((v) => !v)}
            accessibilityLabel={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <MaterialIcons
              name={isFavorite ? 'favorite' : 'favorite-border'}
              size={22}
              color={isFavorite ? '#db1f2f' : '#9ca3af'}
            />
          </TouchableOpacity>

          {/* Image Dots */}
          <View style={styles.imageDots}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* ── Product Info ── */}
        <View style={styles.infoSection}>
          <Text style={styles.brandText}>{product.brand}</Text>
          <Text style={styles.productName}>{product.name}</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <MaterialIcons
                key={star}
                name={star <= 4 ? 'star' : 'star-half'}
                size={16}
                color="#f59e0b"
              />
            ))}
            <Text style={styles.ratingText}>4.5</Text>
            <Text style={styles.reviewCount}>(128 reviews)</Text>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>{product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>{product.originalPrice}</Text>
            )}
          </View>
        </View>

        {/* ── Divider ── */}
        <View style={styles.divider} />

        {/* ── Quantity Selector ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Quantity</Text>
          <View style={styles.qtyRow}>
            {QUANTITIES.map((qty) => (
              <TouchableOpacity
                key={qty}
                style={[styles.qtyPill, selectedQty === qty && styles.qtyPillActive]}
                onPress={() => setSelectedQty(qty)}
                accessibilityLabel={`Select quantity ${qty}`}
              >
                <Text
                  style={[
                    styles.qtyPillText,
                    selectedQty === qty && styles.qtyPillTextActive,
                  ]}
                >
                  {qty}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Divider ── */}
        <View style={styles.divider} />

        {/* ── Description ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Description</Text>
          <Text
            style={styles.descriptionText}
            numberOfLines={descExpanded ? undefined : 3}
          >
            {DESCRIPTION}
          </Text>
          <TouchableOpacity
            onPress={() => setDescExpanded((v) => !v)}
            style={styles.showMoreBtn}
            accessibilityLabel={descExpanded ? 'Show less' : 'Show more'}
          >
            <Text style={styles.showMoreText}>
              {descExpanded ? 'Show less' : 'Show more'}
            </Text>
            <MaterialIcons
              name={descExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={16}
              color="#db1f2f"
            />
          </TouchableOpacity>
        </View>

        {/* ── Divider ── */}
        <View style={styles.divider} />

        {/* ── You May Also Like ── */}
        <View style={styles.relatedSection}>
          <Text style={styles.sectionLabel}>You May Also Like</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.relatedRow}
          >
            {RELATED_PRODUCTS.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                containerStyle={{ width: 148 }}
                onPressAdd={() => {}}
                onPressFavorite={() => {}}
              />
            ))}
          </ScrollView>
        </View>

        {/* Bottom spacer for the fixed footer */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ── Sticky Footer ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.wishlistBtn}
          accessibilityLabel="Add to wishlist"
        >
          <MaterialIcons name="favorite-border" size={18} color="#db1f2f" />
          <Text style={styles.wishlistBtnText}>Wishlist</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addToCartBtn}
          accessibilityLabel="Add to cart"
        >
          <MaterialIcons name="shopping-cart" size={18} color="#fff" />
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
    backgroundColor: '#f8f6f6',
  },
  // Header
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(219,31,47,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 8 : 52,
    paddingBottom: 10,
    zIndex: 50,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#1b0e0f',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#db1f2f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  // Scroll
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 16 },
  // Image
  imageWrapper: {
    width: SCREEN_WIDTH,
    aspectRatio: 1,
    backgroundColor: '#f3f4f6',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  saleBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#db1f2f',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 10,
  },
  saleBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    zIndex: 10,
  },
  imageDots: {
    position: 'absolute',
    bottom: 14,
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
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    width: 20,
    backgroundColor: '#db1f2f',
  },
  // Product Info
  infoSection: {
    backgroundColor: '#fff',
    padding: 20,
  },
  brandText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#955056',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  productName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1b0e0f',
    lineHeight: 26,
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 14,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1b0e0f',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 13,
    color: '#9ca3af',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#db1f2f',
  },
  originalPrice: {
    fontSize: 16,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  // Divider
  divider: {
    height: 8,
    backgroundColor: '#f8f6f6',
  },
  // Shared section
  section: {
    backgroundColor: '#fff',
    padding: 20,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1b0e0f',
    marginBottom: 14,
  },
  // Qty Pills
  qtyRow: {
    flexDirection: 'row',
    gap: 10,
  },
  qtyPill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyPillActive: {
    borderColor: '#db1f2f',
    backgroundColor: '#db1f2f',
    shadowColor: '#db1f2f',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  qtyPillText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6b7280',
  },
  qtyPillTextActive: {
    color: '#fff',
  },
  // Description
  descriptionText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
  },
  showMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 2,
  },
  showMoreText: {
    color: '#db1f2f',
    fontSize: 13,
    fontWeight: '700',
  },
  // Related Products
  relatedSection: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 4,
  },
  relatedRow: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 12,
  },
  // Footer
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(219,31,47,0.1)',
  },
  wishlistBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#db1f2f',
    backgroundColor: '#fff',
  },
  wishlistBtnText: {
    color: '#db1f2f',
    fontSize: 15,
    fontWeight: '700',
  },
  addToCartBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#db1f2f',
    shadowColor: '#db1f2f',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
