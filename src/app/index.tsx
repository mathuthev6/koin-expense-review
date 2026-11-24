import { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";

import { router } from "expo-router";

import { useExpenses } from "../context/ExpensesContext";

import type { Expense } from "../types/expense";

const COLORS = {
  background: "#F4F1EA",
  white: "#FFFFFF",
  navy: "#080F3B",
  green: "#10B981",
  darkGreen: "#008B65",
  muted: "#71807D",
  border: "#DEDCD6",
  paleGreen: "#DDF3EB",
};

export default function ExpensesScreen() {
  const { expenses } = useExpenses();

  const [loading, setLoading] = useState(false);

  // Format currency
  const formatMoney = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  // Open camera or gallery
  const selectReceipt = async (source: "camera" | "gallery") => {
    try {
      let result: ImagePicker.ImagePickerResult;

      if (source === "camera") {
        const permission = await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
          Alert.alert("Permission Required", "Please allow camera access.");
          return;
        }

        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          quality: 0.8,
        });
      } else {
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
          Alert.alert("Permission Required", "Please allow gallery access.");
          return;
        }

        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          quality: 0.8,
        });
      }

      if (result.canceled || !result.assets?.length) {
        return;
      }

      setLoading(true);

      setTimeout(() => {
        setLoading(false);

        router.push({
          pathname: "/review",
          params: {
            imageUri: result.assets[0].uri,
          },
        });
      }, 700);
    } catch (error) {
      setLoading(false);

      Alert.alert("Error", "Unable to select receipt. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* HEADER */}

          <View style={styles.header}>
            <View>
              <Text style={styles.logo}>KOIN</Text>

              <Text style={styles.heading}>Expenses</Text>
            </View>

            <Pressable
              style={styles.scanButton}
              onPress={() => selectReceipt("camera")}
            >
              <Ionicons name="add" size={20} color="#06352A" />

              <Text style={styles.scanButtonText}>Scan Bill</Text>
            </Pressable>
          </View>

          {/* UPLOAD RECEIPT CARD */}

          <View style={styles.uploadCard}>
            {loading ? (
              <>
                <View style={styles.receiptIcon}>
                  <ActivityIndicator size="small" color={COLORS.darkGreen} />
                </View>

                <Text style={styles.uploadHeading}>Scanning your bill...</Text>

                <Text style={styles.uploadDescription}>
                  Please wait a moment
                </Text>
              </>
            ) : (
              <>
                <View style={styles.receiptIcon}>
                  <MaterialCommunityIcons
                    name="receipt-text-outline"
                    size={25}
                    color={COLORS.darkGreen}
                  />
                </View>

                <Text style={styles.uploadHeading}>Upload or Snap a Bill</Text>

                <Text style={styles.uploadDescription}>
                  Less typing. More living.
                </Text>

                <View style={styles.uploadButtons}>
                  <Pressable
                    style={styles.uploadButton}
                    onPress={() => selectReceipt("camera")}
                  >
                    <Ionicons
                      name="camera-outline"
                      size={17}
                      color={COLORS.navy}
                    />

                    <Text style={styles.uploadButtonText}>Camera</Text>
                  </Pressable>

                  <Pressable
                    style={styles.uploadButton}
                    onPress={() => selectReceipt("gallery")}
                  >
                    <Ionicons
                      name="image-outline"
                      size={17}
                      color={COLORS.navy}
                    />

                    <Text style={styles.uploadButtonText}>Gallery</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>

          {/* RECENT ACTIVITY */}

          <View style={styles.activityHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>

            <Text style={styles.weekText}>This week</Text>
          </View>

          {/* TRANSACTIONS */}

          <View>
            {expenses.map((expense: Expense, index: number) => {
              const transactionIcons = [
                "cafe-outline",
                "basket-outline",
                "car-outline",
                "bag-handle-outline",
              ] as const;

              const iconBackgrounds = [
                "#DDF3EB",
                "#EEE7F7",
                "#E5EDF8",
                "#F8EBDD",
              ];

              const iconColors = ["#008B65", "#8656B7", "#080F3B", "#A96820"];

              return (
                <View
                  key={expense.id}
                  style={[
                    styles.transaction,
                    index === expenses.length - 1 && styles.lastTransaction,
                  ]}
                >
                  <View
                    style={[
                      styles.transactionIcon,
                      {
                        backgroundColor: iconBackgrounds[index % 4],
                      },
                    ]}
                  >
                    <Ionicons
                      name={transactionIcons[index % 4]}
                      size={21}
                      color={iconColors[index % 4]}
                    />
                  </View>

                  <View style={styles.transactionDetails}>
                    <Text style={styles.merchantName} numberOfLines={1}>
                      {expense.merchant}
                    </Text>

                    <Text style={styles.transactionDate}>
                      {expense.createdAt}
                    </Text>
                  </View>

                  <Text style={styles.transactionAmount}>
                    {formatMoney(expense.totalCents)}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* BOTTOM NAVIGATION */}

        <View style={styles.bottomNavigation}>
          <NavigationItem icon="home-outline" label="Home" />

          <NavigationItem icon="receipt-outline" label="Expenses" active />

          <NavigationItem icon="bar-chart-outline" label="Insights" />

          <NavigationItem icon="person-outline" label="Profile" />
        </View>
      </View>
    </SafeAreaView>
  );
}

// BOTTOM NAVIGATION COMPONENT

type NavigationItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
};

function NavigationItem({ icon, label, active = false }: NavigationItemProps) {
  return (
    <Pressable
      style={styles.navigationItem}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Ionicons name={icon} size={22} color={active ? "#008B65" : "#687875"} />

      <Text
        style={[styles.navigationLabel, active && styles.activeNavigationLabel]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// STYLES

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 27,
  },

  logo: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2.2,
    color: COLORS.darkGreen,
    marginBottom: 4,
  },

  heading: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    color: COLORS.navy,
    letterSpacing: -0.5,
  },

  scanButton: {
    height: 43,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: COLORS.green,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  scanButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#06352A",
  },

  uploadCard: {
    minHeight: 219,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#9CD7C3",
    borderStyle: "dashed",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    marginBottom: 29,
  },

  receiptIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: COLORS.paleGreen,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },

  uploadHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.navy,
    marginBottom: 6,
  },

  uploadDescription: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 13,
  },

  uploadButtons: {
    flexDirection: "row",
    gap: 10,
  },

  uploadButton: {
    width: 108,
    height: 40,
    borderRadius: 11,
    backgroundColor: "#F4F1EA",
    borderWidth: 1,
    borderColor: "#DCDDD9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  uploadButtonText: {
    fontSize: 13,
    color: COLORS.navy,
    fontWeight: "500",
  },

  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.navy,
  },

  weekText: {
    fontSize: 11,
    color: "#65736F",
  },

  transaction: {
    minHeight: 72,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  lastTransaction: {
    borderBottomWidth: 0,
  },

  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  transactionDetails: {
    flex: 1,
    minWidth: 0,
  },

  merchantName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.navy,
    marginBottom: 5,
  },

  transactionDate: {
    fontSize: 11,
    color: COLORS.muted,
  },

  transactionAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.navy,
    fontVariant: ["tabular-nums"],
  },

  bottomNavigation: {
    height: 78,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: "#E2E0DA",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 8,
  },

  navigationItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  navigationLabel: {
    fontSize: 10,
    color: "#687875",
  },

  activeNavigationLabel: {
    color: "#008B65",
    fontWeight: "700",
  },
});
