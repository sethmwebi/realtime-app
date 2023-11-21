import { Link, Stack } from "expo-router";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false
});

export default function RootLayoutNav() {
  return (
    <ConvexProvider client={convex}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#EEA217"
          },
          headerTintColor: "#fff"
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerTitle: "My Chats",
            headerRight: () => (
              <Link href="/(modal)/create" asChild>
                <TouchableOpacity>
                  <Ionicons name="add" size={32} color="white" />
                </TouchableOpacity>
              </Link>
            )
          }}
        />
        <Stack.Screen
          name="(modal)/create"
          options={{
            headerTitle: "Start a Chat",
            headerTitleAlign: "center",
            presentation: "modal",
            headerLeft: () => (
              <Link href="/" asChild>
                <TouchableOpacity>
                  <Ionicons name="close-outline" size={32} color="white" />
                </TouchableOpacity>
              </Link>
            )
          }}
        />
        <Stack.Screen
          name="(chat)/[chatid]"
          options={{ headerTitle: "", headerTitleAlign: "center" }}
        />
      </Stack>
    </ConvexProvider>
  );
}
