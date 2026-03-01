import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../auth/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface BottomNavProps {
  activeTab: 'Home' | 'Categories' | 'Cart' | 'Profile';
}

export default function BottomNav({ activeTab }: BottomNavProps) {
  const navigation = useNavigation<NavigationProp>();
  const { isLoggedIn } = useAuth();

  const handlePress = (tabName: 'Home' | 'Categories' | 'Cart' | 'Profile') => {
    if (tabName === activeTab) return;

    if (tabName === 'Home') {
      navigation.navigate('Home');
    } else if (tabName === 'Categories') {
      navigation.navigate('Categories');
    } else if (tabName === 'Profile') {
      navigation.navigate(isLoggedIn ? 'Profile' : 'Login');
    } else if (tabName === 'Cart') {
      // navigation.navigate('Cart');
    }
  };

  return (
    <View style={styles.bottomNav}>
      {[
        { key: 'Home' as const, icon: 'home', label: 'Home' },
        { key: 'Categories' as const, icon: 'grid-view', label: 'Categories' },
        { key: 'Cart' as const, icon: 'shopping-cart', label: 'Cart' },
        { key: 'Profile' as const, icon: 'person', label: 'Profile' },
      ].map((item) => (
        <TouchableOpacity
          key={item.key}
          style={styles.navItem}
          onPress={() => handlePress(item.key)}
        >
          <MaterialIcons
            name={item.icon as any}
            size={26}
            color={activeTab === item.key ? '#db1f2f' : '#9ca3af'}
          />
          {item.key === 'Cart' && (
            <View style={styles.navBadge}>
              <Text style={styles.navBadgeText}>2</Text>
            </View>
          )}
          <Text
            style={[
              styles.navLabel,
              { color: activeTab === item.key ? '#db1f2f' : '#9ca3af' },
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(219,31,47,0.1)',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingHorizontal: 16,
    zIndex: 50,
  },
  navItem: {
    alignItems: 'center',
    gap: 2,
    position: 'relative',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  navBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#db1f2f',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#f8f6f6',
  },
  navBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '700',
  },
});
