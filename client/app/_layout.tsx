import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import React, { useRef } from "react";

import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";

import { tokenCache } from "@/lib/auth";
import { View, Text } from "react-native";
import { FeedPageProvider } from "@/hooks/useFeedPage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NotificationProvider } from "@/hooks/useNotifications";
import Toast from "@/components/Toast";

//nice

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  console.log("RootLayout rendered");
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  console.log("Publishable Key: ", publishableKey);

  if (!publishableKey) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red", fontSize: 16 }}>
          Missing Clerk publishable key!
        </Text>
      </View>
    );
  }

  const [error, setError] = useState(null);

  ErrorUtils.setGlobalHandler((error, isFatal) => {
    setError(error);
    if (isFatal) {
      console.error("Fatal Error: ", error);
    } else {
      console.log("Non-fatal Error: ", error);
    }
  });
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
    );
  }

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <ClerkLoaded>
          <NotificationProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Toast />
              <FeedPageProvider>
                <Stack>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="(root)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(auth)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(setUp)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="+not-found" />
                </Stack>
              </FeedPageProvider>
            </GestureHandlerRootView>
          </NotificationProvider>
        </ClerkLoaded>
      </ClerkProvider>
    </>
  );
}
