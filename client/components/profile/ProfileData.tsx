import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useAuthFetch } from "@/hooks/Privatefetch";
import { SignOutButton } from "@/components/SignOut";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { Profile } from "@/types";
import { Image } from "expo-image";
import { colors } from "@/constants";

type ProfileDataProps = {
  profile: Profile;
  setPreview: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfileData = ({ profile, setPreview }: ProfileDataProps) => {
  return (
    <ScrollView>
      <LinearGradient
        colors={[colors.teal, "#050505"]}
        className="items-center py-5 rounded-b-[30px]"
      >
        {profile.images ? (
          <>
            <TouchableOpacity
              className={`absolute top-3 right-2 text-black bg-gray-200 p-2 rounded-full self-end`}
              onPress={() => setPreview(true)}
            >
              <Text className="text-sm text-black">Preview</Text>
            </TouchableOpacity>
            <Image
              source={{ uri: profile.images[0] }}
              style={{ width: 150, height: 150, borderRadius: 100 }}
            />
          </>
        ) : (
          <Text className="text-4xl text-white">No Image</Text>
        )}
        <Text className="mt-2 text-2xl font-bold text-white">
          {profile.name}
        </Text>
        <Text className="text-lg text-white mt-1">
          {profile?.location?.coordinates.join(", ")}
        </Text>
      </LinearGradient>
      <View className="mt-5 px-5">
        <View className="flex-row items-center mb-4">
          <Icon name="envelope" size={20} color={colors.black} />
          <Text className="ml-3 text-base text-gray-800">{profile.email}</Text>
        </View>

        <View className="flex-row items-center mb-4">
          <Icon name="calendar" size={20} color={colors.black} />
          <Text className="ml-3 text-base text-gray-800">
            Age: {profile.age}
          </Text>
        </View>

        <View className="flex-row items-center mb-4">
          <Icon
            name="venus-mars"
            size={20}
            color={`${
              profile.gender === "Male" ? colors.lightBlue : colors.pink
            }`}
          />
          <Text className="ml-3 text-base text-gray-800">
            Gender: {profile.gender}
          </Text>
        </View>

        <View className="flex-row items-center mb-4">
          <Icon name="heart" size={20} color={colors.black} />
          <Text className="ml-3 text-base text-gray-800">
            Interests: {profile.interests.join(", ")}
          </Text>
        </View>

        <View className="flex-row items-center mb-4">
          <Icon name="search" size={20} color={colors.black} />
          <Text className="ml-3 text-base text-gray-800">
            Preferred Gender: {profile.preferredGender}
          </Text>
        </View>

        <View className="flex-row items-center mb-4">
          <Icon name="map-marker" size={20} color={colors.black} />
          <Text className="ml-3 text-base text-gray-800">
            Max Distance: {profile.maxDistance} miles
          </Text>
        </View>

        <View className="flex-row items-center mb-4">
          <Icon name="users" size={20} color={colors.black} />
          <Text className="ml-3 text-base text-gray-800">
            Matched Users: {profile.matchedUsers.length}
          </Text>
        </View>
      </View>
      <TouchableOpacity className="mt-7 bg-[#3eaba5] py-4 mx-5 rounded-full items-center">
        <Text className="text-white text-lg font-bold">Edit Profile</Text>
      </TouchableOpacity>
      <SignOutButton />
    </ScrollView>
  );
};

export default ProfileData;
