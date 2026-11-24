import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ExpensesProvider } from "../context/ExpensesContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ExpensesProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{ headerShown: false, animation: "slide_from_right" }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="review" />
        </Stack>
      </ExpensesProvider>
    </SafeAreaProvider>
  );
}
