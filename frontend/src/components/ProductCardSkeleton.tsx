import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from './Skeleton';

interface ProductCardSkeletonProps {
  containerStyle?: object;
}

export default function ProductCardSkeleton({ containerStyle }: ProductCardSkeletonProps) {
  return (
    <View style={[styles.productCard, containerStyle]}>
      {/* Image Block */}
      <Skeleton style={styles.imageContainer} borderRadius={8} />
      
      {/* Product Info Block */}
      <View style={styles.productInfo}>
        <Skeleton width={80} height={10} borderRadius={4} style={{ marginBottom: 8 }} />
        <Skeleton width="100%" height={16} borderRadius={4} style={{ marginBottom: 4 }} />
        <Skeleton width="60%" height={16} borderRadius={4} />
        
        <View style={styles.productFooter}>
          <Skeleton width={70} height={20} borderRadius={4} />
          <Skeleton width={32} height={32} borderRadius={16} />
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
    marginBottom: 12,
  },
  productInfo: {
    flex: 1,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 'auto',
    paddingTop: 12,
  },
});
