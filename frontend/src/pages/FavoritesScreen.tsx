import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/AppNavigator';
import { useFavoritesStore } from '../store/favoritesStore';
import { useCartStore } from '../store/cartStore';
import ProductCard from '../components/ProductCard';
import ScreenHeader from '../components/ScreenHeader';
import BottomNav from '../components/BottomNav';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function FavoritesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { items } = useFavoritesStore();
  const { addItem } = useCartStore();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f6f6" />
      <ScreenHeader title="My Favorites" backgroundColor="#f8f6f6" />

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="favorite-border" size={56} color="#E5E7EB" />
          <Text style={styles.emptyTitle}>No Favorites Yet</Text>
          <Text style={styles.emptySubText}>Save items you love to quickly find them later</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.shopBtnText}>Start Browsing</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.gridContainer}>
            {items.map((product) => (
              <TouchableOpacity
                key={product.id}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('ProductDetails', { product })}
                style={styles.gridItem}
              >
                <ProductCard
                  product={product}
                  containerStyle={{ width: (SCREEN_WIDTH - 32 - 12) / 2 }}
                  onPressAdd={() => addItem({ 
                    productId: product.id, 
                    name: product.name, 
                    price: product.retailPrice, 
                    imageUrl: product.images?.[0]?.url 
                  })}
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* ── Bottom Nav ── */}
      <BottomNav activeTab="Favorites" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f8f6f6' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100, paddingTop: 16 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { marginBottom: 16 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 32, paddingBottom: 64 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#374151', marginTop: 8 },
  emptySubText: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: 20 },
  shopBtn: {
    marginTop: 20, paddingHorizontal: 24, paddingVertical: 12,
    backgroundColor: '#D32F2F', borderRadius: 12,
  },
  shopBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
});
