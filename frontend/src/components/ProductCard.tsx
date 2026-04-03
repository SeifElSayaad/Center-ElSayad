import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Product } from '../store/productStore';

export type { Product };

interface ProductCardProps {
  product: Product;
  containerStyle?: object;
  onPressFavorite?: () => void;
  onPressAdd?: () => void;
}

export default function ProductCard({ 
  product, 
  containerStyle,
  onPressFavorite,
  onPressAdd
}: ProductCardProps) {
  return (
    <View style={[styles.productCard, containerStyle]}>
      <View style={styles.imageContainer}>
        {product.isFeatured && (
          <View style={styles.saleBadge}>
            <Text style={styles.saleBadgeText}>HOT</Text>
          </View>
        )}
        <Image
          source={{ uri: product.images?.[0]?.url || 'https://placehold.co/400x400?text=No+Image' }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <TouchableOpacity 
          style={styles.favoriteBtn}
          onPress={onPressFavorite}
          accessibilityLabel="Add to wishlist"
        >
          <MaterialIcons name="favorite-border" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productBrand}>Center-ElSayad</Text>
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
        
        <View style={styles.productFooter}>
          <View>
            <Text style={styles.productPrice}>EGP {product.retailPrice.toFixed(2)}</Text>
          </View>
          <TouchableOpacity 
            style={styles.addBtn}
            onPress={onPressAdd}
            accessibilityLabel="Add to cart"
          >
            <MaterialIcons name="add" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(219,31,47,0.05)',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 4,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  saleBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#db1f2f',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 10,
  },
  saleBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  favoriteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  productInfo: {
    flex: 1,
  },
  productBrand: {
    fontSize: 10,
    color: '#955056',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1b0e0f',
    lineHeight: 18,
    height: 36, // Force 2 lines height
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 'auto',
    paddingTop: 12,
  },
  originalPrice: {
    fontSize: 10,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#db1f2f',
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#db1f2f',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#db1f2f',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});
