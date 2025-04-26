import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import Icon from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { MotiView } from "moti";
import { Easing } from "react-native-reanimated";
import { colors } from "@/constants";
import { Profile } from "@/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

type ProfileScreenProps = {
  profile: Profile;
  setEditing: () => void;
  setPreview: (value: boolean) => void;
  setSettings: () => void;
  city: string;
  blockedUsers: Profile[];
  setShowBlockedUsers: (value: boolean) => void;
};

export default function ProfileScreen({
  profile,
  setEditing,
  setPreview,
  setSettings,
  city,
  blockedUsers,
  setShowBlockedUsers,
}: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Hero Section */}
        <LinearGradient
          colors={["#fefefe", "#fafafa"]}
          className="pb-8 rounded-b-3xl border-b border-gray-200"
        >
          <TouchableOpacity
            onPress={setSettings}
            className="absolute top-5 right-5 z-10"
          >
            <MaterialIcons name="settings" size={26} color="#0f172a" />
          </TouchableOpacity>

          <View className="items-center pt-6">
            <View className="relative  rounded-full  ">
              {/* Edit icon */}
              <View className="absolute top-2 left-2 z-10">
                <TouchableOpacity
                  onPress={setEditing}
                  className="bg-black/60 rounded-full p-2 shadow-md"
                >
                  <Icon name="edit-3" size={18} color="#10b5b1" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={setEditing}>
                {profile.images?.[0] ? (
                  <Image
                    source={{ uri: profile.images[0] }}
                    style={{ width: 160, height: 160, borderRadius: 80 }}
                    className="border-4 border-teal-300 "
                  />
                ) : (
                  <View className="w-40 h-40 rounded-full bg-gray-300 items-center justify-center">
                    <Text className="text-white text-lg">No Image</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <Text className="text-3xl font-bold text-gray-900 mt-5">
              {profile.name}, {profile.age}
            </Text>
            <Text className="text-base text-gray-500">{city}</Text>
          </View>
        </LinearGradient>

        {/* Content */}

        <View className="px-6 pt-6 space-y-4">
          <Text className="text-lg italic text-gray-700">
            {profile.bio || "no bio yet."}
          </Text>

          {renderCard("user", `Gender: ${profile.gender}`)}
          {renderCard(
            "sliders",
            `Preferences: ${
              profile.preferredGender
            } • ${profile.preferredAgeRange?.join(" - ")}`
          )}
          {renderCard("heart", `Looking For: ${profile.lookingFor || "N/A"}`)}
          {renderCard(
            "users",
            `Relationship: ${profile.relationshipType || "N/A"}`
          )}
          {renderCard("coffee", `Drinking: ${profile.drinkingHabits || "N/A"}`)}
          {renderCard("smile", `Smoking: ${profile.smokingHabits || "N/A"}`)}
          {profile.pets?.length
            ? renderCard("paw", `Pets: ${profile.pets.join(", ")}`)
            : null}
          {renderCard(
            "instagram",
            profile.socialMedia?.instagram
              ? `@${profile.socialMedia.instagram}`
              : "Instagram not linked"
          )}
          {renderCard("map-pin", `Distance Radius: ${profile.maxDistance} mi`)}
          {renderCard("heart", `Matches: ${profile.matchedUsers?.length || 0}`)}

          <TouchableOpacity
            onPress={() => setShowBlockedUsers(true)}
            className="flex-row items-center gap-2"
          >
            <Icon name="slash" size={18} color={colors.black} />
            <Text className="text-base text-gray-800">
              Blocked Users: {blockedUsers.length}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function renderCard(icon: string, title: string) {
  return (
    <View className="bg-white/90 p-4 rounded-2xl shadow-sm flex-row items-center">
      <Icon name={icon} size={18} color="#1f2937" />
      <Text className="ml-4 text-gray-800 text-base font-medium">{title}</Text>
    </View>
  );
}
