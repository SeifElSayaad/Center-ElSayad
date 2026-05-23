import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  StatusBar,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../auth/AuthContext";
import { useTranslation } from "react-i18next";

import GuestProfileScreen from "./GuestProfileScreen";
import BottomNav from "../components/BottomNav";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Profile">;

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, signOut } = useAuth();
  const { t } = useTranslation();

  if (!user) {
    return <GuestProfileScreen />;
  }

  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const initial = user.firstName ? user.firstName.charAt(0).toUpperCase() : "U";

  async function handleLogout() {
    await signOut();
    navigation.reset({ index: 0, routes: [{ name: "Home" }] });
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* ── Header Section ── */}
      <View style={styles.headerContainer}>
        <View style={styles.topRow}>
          <TouchableOpacity 
            style={styles.userInfoLeft}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View style={styles.userInfoText}>
              <Text style={styles.userName}>{fullName}</Text>
              <Text style={styles.userLocation}>Egypt 🇪🇬</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate("Settings")}
          >
            <MaterialIcons name="settings" size={26} color="#0f172a" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Promotional Banner ── */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>{t("profile.exclusiveDeals")}</Text>
            <Text style={styles.promoSubtitle}>
              {t("profile.freeShipping")}
            </Text>
          </View>
          <View style={styles.promoImageContainer}>
            {/* Using a placeholder generic shopping illustration/icon for the banner */}
            <MaterialCommunityIcons
              name="shopping-search"
              size={60}
              color="rgba(255,255,255,0.4)"
            />
          </View>
        </View>

        {/* ── Flat Menu List ── */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuRow}>
            <View style={styles.menuRowLeft}>
              <MaterialCommunityIcons
                name="gift-outline"
                size={24}
                color="#0f172a"
              />
              <Text style={styles.menuText}>{t("profile.myRewards")}</Text>
            </View>
            <Text style={styles.menuBadge}>{t("profile.points", { count: 0 })}</Text>
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => navigation.navigate("OrderHistory")}
          >
            <View style={styles.menuRowLeft}>
              <MaterialCommunityIcons
                name="receipt"
                size={24}
                color="#0f172a"
              />
              <Text style={styles.menuText}>{t("profile.myOrders")}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuRow}>
            <View style={styles.menuRowLeft}>
              <MaterialCommunityIcons
                name="account-group-outline"
                size={24}
                color="#0f172a"
              />
              <Text style={styles.menuText}>{t("profile.inviteFriends")}</Text>
            </View>
            <Text style={styles.menuBadge}>{t("profile.earn")}</Text>
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuRow}>
            <View style={styles.menuRowLeft}>
              <MaterialCommunityIcons
                name="ticket-percent-outline"
                size={24}
                color="#0f172a"
              />
              <Text style={styles.menuText}>{t("profile.coupons")}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => navigation.navigate("Settings")}
          >
            <View style={styles.menuRowLeft}>
              <MaterialIcons name="settings" size={24} color="#0f172a" />
              <Text style={styles.menuText}>{t("profile.settings")}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuRow}>
            <View style={styles.menuRowLeft}>
              <MaterialCommunityIcons
                name="help-circle-outline"
                size={24}
                color="#0f172a"
              />
              <Text style={styles.menuText}>{t("profile.helpSupport")}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuRow} onPress={handleLogout}>
            <View style={styles.menuRowLeft}>
              <MaterialCommunityIcons name="logout" size={24} color="#dc2626" />
              <Text style={[styles.menuText, { color: "#dc2626" }]}>{t("profile.logout")}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom spacer */}
        <View style={{ height: 40 }} />
      </ScrollView>

      <BottomNav activeTab="Profile" />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#ffffff", // Clean white background throughout
  },

  // Header
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) + 16 : 16,
    backgroundColor: "#ffffff",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  iconBtn: {
    padding: 8,
    marginRight: -8, // visually align right
  },
  userInfoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  userInfoText: {
    justifyContent: "center",
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },
  userName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  userLocation: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
    fontWeight: "500",
  },

  // Scroll
  scrollView: {
    flex: 1,
    backgroundColor: "#f8f6f6", // Light gray background for the scroll area to make cards pop
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 80,
  },

  // Promo Banner
  promoBanner: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: "#db1f2f",
    borderRadius: 16,
    flexDirection: "row",
    overflow: "hidden",
    height: 100,
  },
  promoContent: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  promoTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  promoSubtitle: {
    color: "#ffffff",
    fontSize: 12,
    opacity: 0.9,
  },
  promoImageContainer: {
    width: 100,
    backgroundColor: "rgba(0,0,0,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Menu Container
  menuContainer: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f1f5f9",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },
  menuRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  menuBadge: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginLeft: 60, // Align with text, skipping the icon
  },
});
