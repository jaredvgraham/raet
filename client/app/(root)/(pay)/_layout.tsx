import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="plans" options={{ headerShown: false }} />
    </Stack>
  );
}
