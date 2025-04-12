import React from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Profile } from "@/types";
import RingProgress from "./RingProgress";

const SCREEN_WIDTH = Dimensions.get("window").width;

type Props = {
  user: Profile;
};

export default function ModernCard({ user }: Props) {
  return (
    <ScrollView className="w-full h-full bg-slate-200 rounded-xl overflow-hidden shadow-2xl box ">
      {/* Image + Ring */}
      <View className="relative bg-black">
        <Image
          source={{ uri: user.images[0] }}
          className="w-full h-[500px]"
          contentFit="cover"
        />

        {/* Ring Progress - Top Left */}
        <View className="absolute top-5 left-5 z-10">
          <RingProgress percentage={87} size={70} />
        </View>

        {/* Gradient Overlay */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)"]}
          className="absolute bottom-0 w-full px-6 pb-6 pt-24"
        >
          <Text className="text-white text-3xl font-bold">
            {user.name}, {user.age}
          </Text>
          <Text className="text-gray-200 mt-1">
            {Math.floor(user.distance)} miles away
          </Text>
        </LinearGradient>
      </View>

      {/* Additional Images */}
      {user.images.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4 px-4 space-x-3"
        >
          {user.images.slice(1).map((img, index) => (
            <Image
              key={index}
              source={{ uri: img }}
              className="w-40 h-60 rounded-lg"
              contentFit="cover"
            />
          ))}
        </ScrollView>
      )}

      {/* About Section */}
      <View className="px-6 pt-6">
        <Text className="text-lg font-semibold text-black mb-2">About</Text>
        <Text className="text-gray-700">{user.bio || "No bio yet."}</Text>
      </View>

      {/* Interests */}
      <View className="px-6 pt-6">
        <Text className="text-lg font-semibold text-black mb-2">Interests</Text>
        <View className="flex-row flex-wrap gap-2">
          {user.interests?.length ? (
            user.interests.map((interest) => (
              <Text
                key={interest}
                className="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-700"
              >
                {interest}
              </Text>
            ))
          ) : (
            <Text className="text-gray-500">No interests listed</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
