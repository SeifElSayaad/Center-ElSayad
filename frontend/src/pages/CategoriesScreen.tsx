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
import { useCategoryStore } from '../store/categoryStore';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Data ────────────────────────────────────────────────────────────────────

// Removed static FILTERS and PRODUCTS

// ─── Component ────────────────────────────────────────────────────────────────

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Categories'>;
type CategoriesRouteProp = RouteProp<RootStackParamList, 'Categories'>;

export default function CategoriesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CategoriesRouteProp>();
  const categoryName = route.params?.categoryName ?? 'All Products';

  const { categories, fetchCategories } = useCategoryStore();
  const { products, fetchProducts, isLoading } = useProductStore();
  const { addItem, totalItems } = useCartStore();

  const [activeFilter, setActiveFilter] = useState('All');
  const [userChangedFilter, setUserChangedFilter] = useState(false);
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  React.useEffect(() => {
    fetchCategories();
  }, []);

  // Once categories load, auto-select the one matching the navigation param
  // (only if the user hasn't manually picked a filter yet)
  React.useEffect(() => {
    if (categories.length === 0 || userChangedFilter) return;
    const match = categories.find((c) => c.name === categoryName);
    if (match) setActiveFilter(match.name);
  }, [categories]);

  // Debounce search input — wait 400ms after user stops typing
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch products whenever the active filter OR search query changes
  React.useEffect(() => {
    const c = categories.find(cat => cat.name === activeFilter);
    fetchProducts({
      ...(c ? { category: c.id } : {}),
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
    });
  }, [activeFilter, categories, debouncedSearch]);

  const filters = ['All', ...categories.map(c => c.name)];

  const handleFilterPress = (filter: string) => {
    setUserChangedFilter(true);
    setActiveFilter(filter);
    setSearchQuery(''); // clear search when switching category
  };


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
            onPress={() => navigation.navigate('Cart')}
          >
            <MaterialIcons name="shopping-cart" size={24} color="#1b0e0f" />
            {totalItems() > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalItems()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchRow}>
          <SearchBar 
            placeholder="Search notebooks, pens..."
            value={searchQuery}
            onChangeText={setSearchQuery}
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
          {filters.map((item) => (
            <TouchableOpacity 
              key={item} 
              style={[
                styles.filterPill, 
                activeFilter === item ? styles.filterPillActive : styles.filterPillInactive
              ]}
              onPress={() => handleFilterPress(item)}
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
            {isLoading ? <Text style={{ padding: 16 }}>Loading products...</Text> : products.map((product) => (
              <TouchableOpacity
                key={product.id}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('ProductDetails', { product })}
              >
                <ProductCard
                  product={product as any}
                  containerStyle={{ width: (SCREEN_WIDTH - 32 - 12) / 2 }}
                  onPressAdd={() => addItem({ productId: product.id, name: product.name, price: product.retailPrice, imageUrl: product.images?.[0]?.url })}
                />
              </TouchableOpacity>
            ))}
            {!isLoading && products.length === 0 && <Text style={{ padding: 16 }}>No products found.</Text>}
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
