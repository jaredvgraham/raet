import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

const UserRatingBadge = ({ rating = 9.2 }: { rating: number }) => {
  const { user } = useUser();
  const plan = (user?.publicMetadata?.plan as string)?.toLowerCase() ?? "none";
  const shouldBlur = !["basic", "standard", "premium"].includes(plan);
  const displayRating = rating.toFixed(1);

  const gradientColors = ["black", "black", "black"];
  const router = useRouter();

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <TouchableOpacity
        onPress={() =>
          user?.publicMetadata.plan === "none"
            ? router.push("/(pay)/plans")
            : null
        } // Add your onPress logic here
      >
        <View className="flex items-center justify-center px-3 py-2 rounded-xl">
          <View className="relative">
            <Text className="text-teal-200 text-lg font-bold">
              {displayRating}
            </Text>
            {shouldBlur && (
              <BlurView
                intensity={25}
                tint="light"
                style={StyleSheet.absoluteFillObject}
                className="rounded-xl"
              />
            )}
          </View>
          <Text className="text-white text-xs mt-1">Rating</Text>
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 12,
    alignSelf: "flex-start",
  },
});

export default UserRatingBadge;
