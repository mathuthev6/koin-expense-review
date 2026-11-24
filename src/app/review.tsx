import { useMemo, useState } from "react";

import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { router, useLocalSearchParams } from "expo-router";

import { useExpenses } from "../context/ExpensesContext";

import type { ExpenseItem } from "../types/expense";

const COLORS = {
  background: "#F4F1EA",
  white: "#FFFFFF",
  navy: "#080F3B",
  green: "#10B981",
  darkGreen: "#008B65",
  muted: "#71807D",
  border: "#E2E0DA",
  paleGreen: "#DDF3EB",
  red: "#DC5555",
};

const categories = [
  "Food & Dining",
  "Groceries",
  "Transport",
  "Shopping",
  "Other",
];

export default function ReviewScreen() {
  const params = useLocalSearchParams<{
    imageUri?: string;
  }>();

  const { addExpense } = useExpenses();

  const [merchant, setMerchant] = useState("Cafe Kumbuk");

  const [date, setDate] = useState(
    new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  );

  const [category, setCategory] = useState("Food & Dining");

  const [showCategories, setShowCategories] = useState(false);

  const [items, setItems] = useState<ExpenseItem[]>([
    {
      id: "1",
      name: "Iced Coffee",
      price: "8.50",
    },
    {
      id: "2",
      name: "Chicken Sandwich",
      price: "12.00",
    },
    {
      id: "3",
      name: "Chocolate Cake",
      price: "8.00",
    },
  ]);

  // Calculate total safely using integer cents.

  const totalCents = useMemo(() => {
    return items.reduce((total, item) => {
      const price = Number(item.price);

      if (!Number.isFinite(price) || price < 0) {
        return total;
      }

      return total + Math.round(price * 100);
    }, 0);
  }, [items]);

  const formatMoney = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  // Update item information.

  const updateItem = (id: string, field: "name" | "price", value: string) => {
    setItems((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  // Add a new item.

  const addNewItem = () => {
    setItems((previous) => [
      ...previous,
      {
        id: Date.now().toString(),
        name: "",
        price: "0.00",
      },
    ]);
  };

  // Delete an item.

  const deleteItem = (id: string) => {
    setItems((previous) => previous.filter((item) => item.id !== id));
  };

  // Save expense.

  const saveExpense = () => {
    if (!merchant.trim()) {
      Alert.alert("Missing Merchant", "Please enter the merchant name.");
      return;
    }

    if (items.length === 0) {
      Alert.alert("No Items", "Please add at least one receipt item.");
      return;
    }

    for (const item of items) {
      if (!item.name.trim()) {
        Alert.alert("Missing Item Name", "Please enter a name for every item.");
        return;
      }

      const price = Number(item.price);

      if (item.price.trim() === "" || !Number.isFinite(price) || price < 0) {
        Alert.alert(
          "Invalid Price",
          "Please enter a valid non-negative price for every item.",
        );
        return;
      }
    }

    if (totalCents <= 0) {
      Alert.alert(
        "Invalid Total",
        "The receipt total must be greater than zero.",
      );
      return;
    }

    const now = new Date();

    const expense = {
      id: Date.now().toString(),
      merchant: merchant.trim(),
      date: date.trim(),
      category,
      items: items.map((item) => ({
        ...item,
        name: item.name.trim(),
        price: Number(item.price).toFixed(2),
      })),
      totalCents,
      createdAt: now.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    addExpense(expense);

    Alert.alert(
      "Expense Saved!",
      `${merchant} has been added to your expenses.`,
      [
        {
          text: "OK",
          onPress: () => router.replace("/"),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color={COLORS.navy} />
          </Pressable>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Review Receipt</Text>

            <Text style={styles.headerSubtitle}>
              Check your details before saving
            </Text>
          </View>

          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* RECEIPT IMAGE */}

          <View style={styles.receiptCard}>
            <Text style={styles.cardHeading}>RECEIPT IMAGE</Text>

            {params.imageUri ? (
              <Image
                source={{ uri: params.imageUri }}
                style={styles.receiptImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons
                  name="receipt-outline"
                  size={38}
                  color={COLORS.darkGreen}
                />

                <Text style={styles.placeholderText}>Receipt Preview</Text>
              </View>
            )}
          </View>

          {/* MERCHANT DETAILS */}

          <View style={styles.detailsCard}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="storefront-outline"
                size={19}
                color={COLORS.darkGreen}
              />

              <Text style={styles.sectionTitle}>Merchant Details</Text>
            </View>

            <Text style={styles.inputLabel}>Merchant Name</Text>

            <TextInput
              style={styles.input}
              value={merchant}
              onChangeText={setMerchant}
              placeholder="Enter merchant name"
              placeholderTextColor="#A0A6A2"
            />

            <Text style={styles.inputLabel}>Date</Text>

            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="Enter date"
              placeholderTextColor="#A0A6A2"
            />

            <Text style={styles.inputLabel}>Category</Text>

            <Pressable
              style={styles.categorySelector}
              onPress={() => setShowCategories(!showCategories)}
            >
              <Text style={styles.categoryText}>{category}</Text>

              <Ionicons
                name={showCategories ? "chevron-up" : "chevron-down"}
                size={19}
                color={COLORS.navy}
              />
            </Pressable>

            {showCategories && (
              <View style={styles.categoryList}>
                {categories.map((item) => (
                  <Pressable
                    key={item}
                    style={styles.categoryOption}
                    onPress={() => {
                      setCategory(item);
                      setShowCategories(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.categoryOptionText,
                        category === item && styles.selectedCategoryText,
                      ]}
                    >
                      {item}
                    </Text>

                    {category === item && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={COLORS.darkGreen}
                      />
                    )}
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* RECEIPT ITEMS */}

          <View style={styles.itemsCard}>
            <View style={styles.itemsHeader}>
              <View style={styles.sectionHeader}>
                <Ionicons
                  name="list-outline"
                  size={19}
                  color={COLORS.darkGreen}
                />

                <Text style={styles.sectionTitle}>Extracted Items</Text>
              </View>

              <Text style={styles.itemCount}>{items.length} items</Text>
            </View>

            {/* COLUMN HEADINGS */}

            <View style={styles.columnHeader}>
              <Text style={styles.nameColumn}>ITEM NAME</Text>

              <Text style={styles.priceColumn}>PRICE ($)</Text>

              <View style={styles.deleteColumn} />
            </View>

            {/* ITEM LIST */}

            {items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <TextInput
                  style={styles.itemNameInput}
                  value={item.name}
                  onChangeText={(value) => updateItem(item.id, "name", value)}
                  placeholder="Item name"
                  placeholderTextColor="#A0A6A2"
                />

                <TextInput
                  style={styles.itemPriceInput}
                  value={item.price}
                  onChangeText={(value) =>
                    updateItem(item.id, "price", value.replace(/[^0-9.]/g, ""))
                  }
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor="#A0A6A2"
                />

                <Pressable
                  style={styles.deleteButton}
                  onPress={() => deleteItem(item.id)}
                >
                  <Ionicons name="trash-outline" size={19} color={COLORS.red} />
                </Pressable>
              </View>
            ))}

            {/* ADD ITEM */}

            <Pressable style={styles.addItemButton} onPress={addNewItem}>
              <Ionicons
                name="add-circle-outline"
                size={20}
                color={COLORS.darkGreen}
              />

              <Text style={styles.addItemText}>Add Item</Text>
            </Pressable>
          </View>

          {/* TOTAL */}

          <View style={styles.totalCard}>
            <View>
              <Text style={styles.totalLabel}>Total Amount</Text>

              <Text style={styles.totalDescription}>
                {items.length} receipt items
              </Text>
            </View>

            <Text style={styles.totalAmount}>{formatMoney(totalCents)}</Text>
          </View>
        </ScrollView>

        {/* SAVE BUTTON */}

        <View style={styles.footer}>
          <Pressable style={styles.saveButton} onPress={saveExpense}>
            <Ionicons
              name="checkmark-circle-outline"
              size={21}
              color="#FFFFFF"
            />

            <Text style={styles.saveButtonText}>Confirm & Save Expense</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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

  header: {
    height: 76,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitleContainer: {
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.navy,
  },

  headerSubtitle: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 4,
  },

  headerPlaceholder: {
    width: 42,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 25,
  },

  receiptCard: {
    backgroundColor: COLORS.white,
    borderRadius: 17,
    padding: 15,
    marginBottom: 15,
  },

  cardHeading: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: COLORS.muted,
    marginBottom: 12,
  },

  receiptImage: {
    width: "100%",
    height: 145,
    borderRadius: 10,
    backgroundColor: "#F8F8F5",
  },

  imagePlaceholder: {
    height: 110,
    borderRadius: 10,
    backgroundColor: "#F4F8F4",
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 8,
  },

  detailsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 17,
    padding: 17,
    marginBottom: 15,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.navy,
  },

  inputLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.muted,
    marginTop: 16,
    marginBottom: 7,
  },

  input: {
    height: 43,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: COLORS.navy,
    backgroundColor: "#FDFDFC",
  },

  categorySelector: {
    height: 43,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  categoryText: {
    fontSize: 13,
    color: COLORS.navy,
  },

  categoryList: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    marginTop: 6,
    overflow: "hidden",
  },

  categoryOption: {
    minHeight: 42,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0EC",
  },

  categoryOptionText: {
    fontSize: 13,
    color: COLORS.navy,
  },

  selectedCategoryText: {
    color: COLORS.darkGreen,
    fontWeight: "700",
  },

  itemsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 17,
    padding: 17,
    marginBottom: 15,
  },

  itemsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  itemCount: {
    fontSize: 11,
    color: COLORS.muted,
  },

  columnHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 22,
    marginBottom: 8,
  },

  nameColumn: {
    flex: 1,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.7,
    color: COLORS.muted,
  },

  priceColumn: {
    width: 88,
    textAlign: "center",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.7,
    color: COLORS.muted,
  },

  deleteColumn: {
    width: 34,
  },

  itemRow: {
    minHeight: 55,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0EC",
    gap: 5,
  },

  itemNameInput: {
    flex: 1,
    minWidth: 0,
    height: 42,
    fontSize: 12,
    color: COLORS.navy,
    paddingHorizontal: 8,
    backgroundColor: "#FAFAF8",
    borderRadius: 8,
  },

  itemPriceInput: {
    width: 83,
    height: 42,
    textAlign: "center",
    fontSize: 12,
    color: COLORS.navy,
    backgroundColor: "#FAFAF8",
    borderRadius: 8,
    paddingHorizontal: 4,
  },

  deleteButton: {
    width: 34,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  addItemButton: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#91CBB6",
    borderRadius: 10,
    backgroundColor: "#F7FBF8",
  },

  addItemText: {
    color: COLORS.darkGreen,
    fontSize: 13,
    fontWeight: "700",
  },

  totalCard: {
    backgroundColor: COLORS.paleGreen,
    borderRadius: 15,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.navy,
  },

  totalDescription: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 5,
  },

  totalAmount: {
    fontSize: 23,
    fontWeight: "800",
    color: COLORS.darkGreen,
  },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: COLORS.background,
  },

  saveButton: {
    height: 53,
    borderRadius: 14,
    backgroundColor: COLORS.darkGreen,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
