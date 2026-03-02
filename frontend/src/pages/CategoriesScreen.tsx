import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import BottomNav from '../components/BottomNav';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Data ────────────────────────────────────────────────────────────────────

const FILTERS = ['All', 'Notebooks', 'Pens & Pencils', 'Organizers', 'Paper'];

const PRODUCTS = [
  {
    id: '1',
    name: 'Premium Hardcover Notebook, A5 Black',
    brand: 'Stationery Co.',
    price: '$18.99',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbLfZuoEzdjeSNlgWTj4u61KpPPSBZ9e8TjFK8kAvzWSbKwxGKzfBdqBCg6QXF2n3D2ddRcKUHP8E-X7XBrrHq16EBnbWQXmORn3Vhp5-Ijg2L8TqSM9bdyShmKR1nuQjhV3BhTqgDeLh8t66qmZDetcYhQgFaxfwif5lDpZHw6xTQ0qw9E_zAYRPuGlnA2LT1IYXvsJ5BIXGv4cx68xwgR3rmRniV1wH6zWKCY_QMSdyTb9X4cYfpeHWTjdcsbov_Kp1PA4DZ2iw',
    favorite: false,
  },
  {
    id: '2',
    name: 'Gel Pen Set, 12 Colors Fine Point',
    brand: 'ArtMate',
    price: '$12.50',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV4ZA4kw3-vwhsIfrvMJHbMFOa-kaxrZXJIN6KfG1JI2DWyrfZDNeJW-TJEMh2JkOPT2XJg4ULupZJaaf8QEvADXsAzhgP6kld3KEJygMZMVxDh2tfPm2aAB0gR_cK5exz05fchQKI8yQcGS8N6gS-WQHYr5gK_KUT8sv7vtLo2cm3zp3YvOz7-C_vPVXDcKDGN5AdED2kQHIWVlwKiBzT7QR6hoW8O_WI2KfEN5wiOLjRtpJU4r_Fhzf4H2qmC7CxbTtRscK9RlA',
    favorite: false,
  },
  {
    id: '3',
    name: 'Urban Commuter Backpack, 20L Grey',
    brand: 'TravelGear',
    price: '$45.00',
    originalPrice: '$55.00',
    sale: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf82Hb6ZDUt8XcojDPZPxyEPgljt-A29SLU_0efiYUU0SHJ05Vm3sxL7ZkMcQaNMTPOahj4H9KYVdtcyIM6KoltYimhv7U78Wr9cKw7v6Z0DOIQ5_RW8dg8Jjue2YTEcPbFtJyii_HJ_QevX2Z5l7fel-xazDfhrQuJyEVC6Nra6xSFVF6RdxygirBx8WSmk1WWgLdPTi_hG6ZDZ9NWtP0bcWxbg_S30wnO7xjOKAWMC-4GqUhe65xdX5QPXl8nTnuMqbI4saUpfA',
    favorite: false,
  },
  {
    id: '4',
    name: 'Mesh Desk Organizer Set, Silver',
    brand: 'OfficePro',
    price: '$24.99',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLwCvxkNVQ_jbvzYvYfLJWuwfrYFZK18oj5ZJi-jRh3WbcyGehmQlh_E8egvu7ehIxlr85S_mes-r-UAwrkKsDCiI6Zh41e6T1B5u8UKX9U177JexsVNhbTym5GplxOhiVHOMbJ0-aslY-D3hvxQ7OL3WKmC63e1rc2d0968Ex3pMxuJupcXeOtPsflSaP2T3Vai1IGN61eJgbqX8Fu6dtPqsegcue2gJGR-oxztLF1H66ixfBOqE_HhbSsCLk4uL9le7RyHGyv5E',
    favorite: false,
  },
  {
    id: '5',
    name: 'Heavy Duty Stapler, 50 Sheets',
    brand: 'OfficePro',
    price: '$15.49',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0rjggE6qb38V0ERe34RzRQx-suKJvOeLcGKcvL3f9e_au0ERHNKIk0Y-BZ5ddQHyCvSxkJ2-2UQUi0vGaXGehi0zvrvm3wtKOWPIVHe8WBBOcaTlx7f8H7lwHivGzWySi67GnlfhkvQ81NcA7MKo6tsYUSvT5jv0DB1hKzeT2J2-GqjAtHnBY0YzF-dgXnn-cKhDAVkwjtoeYv4yNwq5UluCE3a9GJSF44t_3mrNyY3KFhyOZ9ppPGNPWpe3n8c1lAHVNUbbYXq0',
    favorite: false,
  },
  {
    id: '6',
    name: 'Sticky Notes Value Pack, 12 Pads',
    brand: 'PaperMate',
    price: '$8.99',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcwHXp1DL-o5WTwMch9N1DGPyO6cg-72PiW0ctiVw-4HvqwIPUGQ3qeesYNLaN60w8ke7dpcI8RgRTNS6RVvttzG4jqYky0Y_5Kocatl-SLxqMBdAxBL6BtpBF9diFBekj2M8xzsUoQbkmOGAzmxfXgUheNaXTtXWmEvPiArv5v_HHU7Y9DyqsLyZ97-rB4n2fRzljES04vkelXRRJWuSy1CS5N_LEtrcn24YdA3ZX8xhWULpT0uIfErz3ETgEMAnsIKZbuxFgqnA',
    favorite: false,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Categories'>;
type CategoriesRouteProp = RouteProp<RootStackParamList, 'Categories'>;

export default function CategoriesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CategoriesRouteProp>();
  const categoryName = route.params?.categoryName ?? 'All Products';

  // Seed the active filter from the selected category if it matches a pill
  const matchedFilter = FILTERS.find((f) => categoryName.includes(f)) ?? 'All';
  const [activeFilter, setActiveFilter] = useState(matchedFilter);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* ── Top Bar ── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.iconBtn}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
          >
            <MaterialIcons name="arrow-back" size={24} color="#1b0e0f" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{categoryName}</Text>
          <TouchableOpacity 
            style={styles.iconBtn}
            accessibilityLabel="View cart"
          >
            <MaterialIcons name="shopping-cart" size={24} color="#1b0e0f" />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchRow}>
          <SearchBar 
            placeholder="Search notebooks, pens..."
          />
          <TouchableOpacity 
            style={styles.filterBtn}
            accessibilityLabel="Filter results"
          >
            <MaterialIcons name="tune" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Filter Pills */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          {FILTERS.map((item) => (
            <TouchableOpacity 
              key={item} 
              style={[
                styles.filterPill, 
                activeFilter === item ? styles.filterPillActive : styles.filterPillInactive
              ]}
              onPress={() => setActiveFilter(item)}
            >
              <Text style={[
                styles.filterPillText,
                activeFilter === item ? styles.filterPillTextActive : styles.filterPillTextInactive
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Promo Banner ── */}
        <ImageBackground 
          style={styles.promoBanner}
          source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXnTv_5FIT8DLpwTNgqaNHNE9GUy515RXG4peJCl8nKJMaEUv6UMT1boAL0UhrxA0xascSrW_z9PfFRUDAHIku7v2wdj049-tBKqHYupPBUL7F2Oj2IC-QWRBFJ8eH89SsJ6afxnHuWERNniP7ngySnkesZ64cqGfOTbHWBOMTr17_1rSsentflc-TMimw-75sIGw_CvRq0-LDkO56QSld5IOSv5FqamVS3k7FNEHVMwwFJWWQKB30v4z97RVYw5FQ6IG-wnH7zXA' }}
          imageStyle={{ opacity: 0.2 }}
        >
          <View style={styles.promoContent}>
            <Text style={styles.promoEyebrow}>BACK TO SCHOOL</Text>
            <Text style={styles.promoTitle}>Get 20% Off</Text>
            <Text style={styles.promoSubtitle}>On all premium stationery items this week.</Text>
            <TouchableOpacity style={styles.promoBtn}>
              <Text style={styles.promoBtnText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* ── Popular Items Header ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Items</Text>
          <TouchableOpacity style={styles.viewAllBtn}>
            <Text style={styles.viewAllText}>View All</Text>
            <MaterialIcons name="arrow-forward" size={16} color="#db1f2f" />
          </TouchableOpacity>
        </View>

        {/* ── Product Grid ── */}
        <View style={styles.productGrid}>
          {PRODUCTS.map((product) => (
            <TouchableOpacity
              key={product.id}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('ProductDetails', { product })}
            >
              <ProductCard
                product={product}
                containerStyle={{ width: (SCREEN_WIDTH - 32 - 12) / 2 }}
              />
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* ── Bottom Navigation ── */}
      <BottomNav activeTab="Categories" />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8f6f6',
  },
  header: {
    backgroundColor: 'rgba(248, 246, 246, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(219,31,47,0.1)',
    zIndex: 50,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 24 : 44,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1b0e0f',
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
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#db1f2f',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#db1f2f',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  filterScroll: {
    marginBottom: 12,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: '#db1f2f',
    borderColor: '#db1f2f',
  },
  filterPillInactive: {
    backgroundColor: '#fff',
    borderColor: 'rgba(219,31,47,0.1)',
  },
  filterPillText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterPillTextActive: {
    color: '#fff',
  },
  filterPillTextInactive: {
    color: '#1b0e0f',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  promoBanner: {
    backgroundColor: '#db1f2f',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    overflow: 'hidden',
  },
  promoContent: {
    width: '66%',
  },
  promoEyebrow: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    opacity: 0.9,
    marginBottom: 4,
  },
  promoTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  promoSubtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 16,
  },
  promoBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  promoBtnText: {
    color: '#db1f2f',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1b0e0f',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    color: '#db1f2f',
    fontSize: 12,
    fontWeight: '700',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
});
