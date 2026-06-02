import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { productApi } from '../services/productApi';

type RouteProps = RouteProp<RootStackParamList, 'WriteReview'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'WriteReview'>;

export default function WriteReviewScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { product } = route.params;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      await productApi.submitReview(product.id, rating, comment);
      // Success - normally we might show a toast, but navigating back is fine for now
      // In a real app we might pass a param back to trigger a refresh
      navigation.goBack();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit review');
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fbf9f9" />
      
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <MaterialIcons name="close" size={24} color="#1b1c1c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Write Review</Text>
        <View style={styles.closeBtn} />
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          
          {/* ── Product Summary ── */}
          <View style={styles.productSummary}>
            <Image 
              source={{ uri: product.images?.[0]?.url || 'https://picsum.photos/seed/default/100/100' }} 
              style={styles.productThumb} 
              resizeMode="cover"
            />
            <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
          </View>

          {/* ── Rating Selector ── */}
          <View style={styles.ratingSection}>
            <Text style={styles.ratingLabel}>Tap to Rate</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)} style={styles.starBtn}>
                  <MaterialIcons
                    name={rating >= star ? 'star' : 'star-border'}
                    size={42}
                    color={rating >= star ? '#db1f2f' : '#dbdada'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── Comment Input ── */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Review Comment (Optional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Share your experience with this product..."
              placeholderTextColor="#9ca3af"
              multiline
              textAlignVertical="top"
              value={comment}
              onChangeText={setComment}
              maxLength={500}
            />
            <Text style={styles.charCount}>{comment.length}/500</Text>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
        </View>
      </TouchableWithoutFeedback>

      {/* ── Bottom Action ── */}
      <View style={styles.bottomBar}>
        <Text style={styles.disclaimerText}>
          Note: You can only have one review per product. Submitting this will update your previous review if you have one.
        </Text>
        <TouchableOpacity 
          style={[styles.submitBtn, rating === 0 && styles.submitBtnDisabled]} 
          onPress={handleSubmit}
          disabled={rating === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitBtnText}>Submit Review</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fbf9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 8 : 52,
    paddingBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: '#fbf9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#efeded',
  },
  closeBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1b1c1c',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  productSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#e9e8e8',
  },
  productThumb: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f5f3f3',
  },
  productName: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#1b1c1c',
    lineHeight: 20,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1b1c1c',
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  starBtn: {
    padding: 4,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1b1c1c',
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e9e8e8',
    borderRadius: 12,
    padding: 16,
    height: 140,
    fontSize: 15,
    color: '#1b1c1c',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 6,
  },
  errorText: {
    color: '#ba1a1a',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  bottomBar: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: '#fbf9f9',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 18,
  },
  submitBtn: {
    backgroundColor: '#db1f2f',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#db1f2f',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  submitBtnDisabled: {
    backgroundColor: '#e4e2e2',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
