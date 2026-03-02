import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  StatusBar,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import BottomNav from '../components/BottomNav';
import SearchBar from '../components/SearchBar';
import ProductCard, { Product } from '../components/ProductCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Data ────────────────────────────────────────────────────────────────────

const BANNERS = [
  {
    id: '1',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7nmXgM2mY2zngaIpCAvMZF3Nx-6TSNuD5C_7KMnwPnA0KpbiC2WeYCupeAk3hK_HHA2-J3s9yhIvYQCKoAPZS0B-xZC6DSNlc2YiN0kgRwH9DV1-xGCtyTJ67crwPtII2f0YqxtSqoUdn-GGFfNGEQDFy0EyrAsWa1tAJsGZf9nYnLTo493pA68ltEVBLsaLlkJRgaDN37Z6D9sL-3cJTIn2IBRAOnU79PSfBOz_vkMoaN6Zsjcj-QhNVp6QBCpbPdI2TzBsqEAc',
    badge: 'Seasonal Offer',
    title: 'Back to School Essentials',
    subtitle: 'Up to 50% off on all notebooks and backpacks',
    cta: 'Shop Now',
    ctaStyle: 'white',
  },
  {
    id: '2',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5V0EeaZVJmkgd87ZbMoguxvWtd-gSNVhTKjctpN4jRD3fQsBvkzX7NBATDD7R7jI2FJhaucOcvukhmc6uSUm6Y5-anpFnBV4JhBtVjclpK16KDey_Zvo81MzRpeBrO7PEEFJ2aLVTiPJvmYXA7lEKCrY1-yNiObH1HD3q1rxLWXmGimNyn5r7OpI5YAPUW-5N8ApwcFIc9EFVl_rtw_T4Gatw0LgmwIaBpoQNGYHRedED1QqKXh3TQWwcnwQA-lHYHlKzedVierY',
    badge: null,
    title: 'Modern Office Upgrade',
    subtitle: 'Premium desk tech & ergonomic accessories',
    cta: 'Explore Tech',
    ctaStyle: 'primary',
  },
];

const CATEGORIES = [
  { id: '1', icon: 'business-center', label: 'Office\nSupplies', lib: 'material' },
  { id: '2', icon: 'school', label: 'School\nSupplies', lib: 'material' },
  { id: '3', icon: 'menu-book', label: 'Books\n& Novels', lib: 'material' },
  { id: '4', icon: 'toys', label: 'Toys\n& Games', lib: 'material' },
];

const PRODUCTS = [
  {
    id: '1',
    name: 'Vector Gold Trim Rollerball Pen',
    brand: 'PARKER',
    price: '$45.00',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjY1Rl4QUSHC7tdJN1TrTlyU111pyR4bmJvZMAZ-RACDRDEo_UzHoic26QNK436wrDYWzPK80f7Qas0fL9vSHGPpfmanz524Qs_jrdvhCb9yNLJ1BIc6ksqhQ7g8mzAdjcg0_pKaQ_LAapqHMhomyhtIWpNKa_SrEsIlKj84UNEXwbtxhV5Ob3cyOLmIpeh4jytANdN3YyEB5eIV-upOCYkiYgy_WfBaaBJTdN8DDKi6DRk-63AZfbWx0_VFGMyzP4_DTolJwlmH0',
  },
  {
    id: '2',
    name: 'Hard Cover Classic Notebook - L',
    brand: 'MOLESKINE',
    price: '$22.50',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANHTvG-Sla_vBnsGx2ClDeDAGGqK38AUxPh_zb36qKKpmtQ3FdMq2LjThBxXqhILVTIQOGBgDBzt1LGcRu4wYoix0rwKaIaLgi_7stEy2qhdKPyN3ltEGTGG5CJni8NiJH97UYRvJ1z6ESKQESM4omfaVbxHe9_UCDtjcpvQ6bLgArCUXxLkg1-0bH-8C1NGTm0UimRj_zVoQdhCPWTa8nzLmGyvrnySCPsStVqdkQ--cqAx3KuYasvOuY4uw1Uixvtxu1FQNunas',
  },
  {
    id: '3',
    name: 'FX-991EX Scientific Classwiz',
    brand: 'CASIO',
    price: '$38.00',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVBpUfLsix3-ZeR4TUkwCqTg4WsgjdJSyqXvF34CTPAw8cOjHfWvHaKOniVBdNFsVS1qSJh8bqTFM6f7RWAXfGgelKA0QQ7TmSjhtTqPe9vd0mZU2Ol-Q7X9uxmDC6YENgrzm1v9ftvcqr_vIV8yBXiyMg3m1I9NLorE0MEGQR0j6HXZ9RDY9buSTOwscvVmkUvlP3WDxiBE8_tTm_gEMxWP8gpaT8KRQ-7QKQ_awW5ioT2Aqrwe8Bg4lRg_asHNDYTZ0NSS3RiT8',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {/* Logo */}
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          {/* Cart Button */}
          <TouchableOpacity style={styles.cartBtn}>
            <MaterialIcons name="shopping-cart" size={26} color="#1b0e0f" />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar Place */}  
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Hero Banner Carousel ── */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.bannerScroll}
        >
          {BANNERS.map((banner) => (
            <ImageBackground
              key={banner.id}
              source={{ uri: banner.image }}
              style={styles.bannerCard}
              imageStyle={styles.bannerImage}
            >
              <View style={styles.bannerOverlay} />
              <View style={styles.bannerContent}>
                {banner.badge && (
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{banner.badge.toUpperCase()}</Text>
                  </View>
                )}
                <Text style={styles.bannerTitle}>{banner.title}</Text>
                <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                <TouchableOpacity
                  style={[
                    styles.bannerBtn,
                    banner.ctaStyle === 'white' ? styles.bannerBtnWhite : styles.bannerBtnPrimary,
                  ]}
                >
                  <Text
                    style={[
                      styles.bannerBtnText,
                      banner.ctaStyle === 'white' ? { color: '#db1f2f' } : { color: '#fff' },
                    ]}
                  >
                    {banner.cta}
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          ))}
        </ScrollView>

        {/* ── Category Grid ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Categories', {})}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity 
                key={cat.id} 
                style={styles.categoryItem}
              onPress={() => navigation.navigate('Categories', { categoryName: cat.label.replace('\n', ' ') })}
              >
                <View style={styles.categoryIconBox}>
                  <MaterialIcons name={cat.icon as any} size={32} color="#db1f2f" />
                </View>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Featured Products ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <View style={styles.arrowButtons}>
              <TouchableOpacity style={styles.arrowBtn}>
                <MaterialIcons name="chevron-left" size={20} color="#1b0e0f" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.arrowBtn}>
                <MaterialIcons name="chevron-right" size={20} color="#1b0e0f" />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsRow}
          >
            {PRODUCTS.map((product) => (
              <TouchableOpacity
                key={product.id}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('ProductDetails', { product })}
              >
                <ProductCard
                  product={product}
                  containerStyle={{ width: 155 }}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Promo Banner ── */}
        <View style={[styles.section, styles.promoBanner]}>
          <View>
            <Text style={styles.promoTitle}>Office Essentials Kit</Text>
            <Text style={styles.promoSubtitle}>
              Get everything you need for your new workspace in one curated pack.
            </Text>
            <TouchableOpacity style={styles.promoBtn}>
              <Text style={styles.promoBtnText}>Browse Pack</Text>
            </TouchableOpacity>
          </View>
          <MaterialCommunityIcons
            name="package-variant-closed"
            size={90}
            color="#db1f2f"
            style={styles.promoIcon}
          />
        </View>

        {/* Bottom spacer so content isn't hidden under the nav bar */}
        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ── Bottom Navigation ── */}
      <BottomNav activeTab="Home" />
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 44,
    paddingBottom: 12,
    zIndex: 50,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  logo: {
    height: 35,
    width: 140,
  },
  cartBtn: {
    padding: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#db1f2f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  searchBarContainer: {
    paddingHorizontal: 0,
    paddingTop: 8,
  },
  // Scroll
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 80 },
  // Banners
  bannerScroll: { marginTop: 16, paddingHorizontal: 16 },
  bannerCard: {
    width: SCREEN_WIDTH - 32,
    aspectRatio: 21 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    marginRight: 8,
  },
  bannerImage: { borderRadius: 12 },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bannerContent: {
    paddingLeft: 20,
    maxWidth: '65%',
    zIndex: 10,
  },
  badgeContainer: {
    backgroundColor: '#db1f2f',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    marginBottom: 10,
  },
  bannerBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  bannerBtnWhite: { backgroundColor: '#fff' },
  bannerBtnPrimary: { backgroundColor: '#db1f2f' },
  bannerBtnText: { fontSize: 13, fontWeight: '700' },
  // Section
  section: {
    marginTop: 28,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1b0e0f',
  },
  seeAll: {
    color: '#db1f2f',
    fontSize: 13,
    fontWeight: '700',
  },
  // Category Grid
  categoryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryItem: {
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  categoryIconBox: {
    width: '88%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1b0e0f',
    lineHeight: 14,
  },
  // Arrow Buttons
  arrowButtons: { flexDirection: 'row', gap: 8 },
  arrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Products
  productsRow: {
    paddingRight: 16,
    gap: 12,
  },
  // Promo Banner
  promoBanner: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  promoSubtitle: {
    color: '#9ca3af',
    fontSize: 11,
    maxWidth: 170,
    lineHeight: 16,
    marginBottom: 14,
  },
  promoBtn: {
    backgroundColor: '#db1f2f',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  promoBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  promoIcon: {
    opacity: 0.3,
    position: 'absolute',
    right: 12,
    bottom: -10,
  },
});
