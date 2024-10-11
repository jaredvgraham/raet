import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useAuthFetch } from "@/hooks/Privatefetch";
import { SignOutButton } from "@/components/SignOut";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { Profile } from "@/types";
import { Image } from "expo-image";
import { colors } from "@/constants";
import EditProfileScreen from "./EditProfileScreen";
import { getCityFromLocation } from "@/utils/contants";
import Header from "../header";
import DeleteAccount from "./DeleteAccount";
import BlockedUsers from "./BlockedUsers";

type ProfileDataProps = {
  profile: Profile;
  setPreview: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfileData = ({ profile, setPreview }: ProfileDataProps) => {
  const [editing, setEditing] = useState(false);
  const authFetch = useAuthFetch();
  const [city, setCity] = useState<string>();
  const [blockedUsers, setBlockedUsers] = useState<Profile[]>([]);
  const [showBlockedUsers, setShowBlockedUsers] = useState(false);
  console.log(`profile`, profile);

  const getBlockedUsers = async () => {
    try {
      const response = await authFetch("/api/block", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response?.json();
      setBlockedUsers(data.blockedUsers);
      console.log("Blocked users:", data);
    } catch (error) {
      console.error("Error fetching blocked users:", error);
    }
  };

  useEffect(() => {
    console.log("editing", editing);
    const getCity = async () => {
      const cityName = await getCityFromLocation(
        profile?.location?.coordinates[1],
        profile?.location?.coordinates[0]
      );

      if (cityName) {
        setCity(cityName.city || "Unknown Location");
      }
    };
    getCity();
    getBlockedUsers();
  }, [editing]);

  const sendData = async (updatedProfile: Profile) => {
    try {
      const formData = new FormData();

      // Append non-file fields
      formData.append("name", updatedProfile.name);
      if (updatedProfile.bio) formData.append("bio", updatedProfile.bio);
      formData.append("preferredGender", updatedProfile.preferredGender);
      formData.append("maxDistance", updatedProfile.maxDistance.toString());
      formData.append("interests", updatedProfile.interests.join(","));

      // Append image files
      for (const image of updatedProfile.images) {
        formData.append("images", {
          uri: image,
          type: "image/jpeg",
          name: "image",
        } as any);
      }

      console.log("formData", formData);

      const response = await authFetch("/api/user/profile/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await response?.json();
      console.log("Profile updated successfully:", data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (showBlockedUsers) {
    return (
      <BlockedUsers
        initialBlockedUsers={blockedUsers}
        setShowBlockedUsers={setShowBlockedUsers}
      />
    );
  }

  return (
    <ScrollView>
      <Header style="w-full flex items-center justify-center" />
      {editing ? (
        <EditProfileScreen
          profile={profile}
          onSave={(updatedProfile) => {
            sendData(updatedProfile);
            setEditing(false);
            console.log("updatedProfile", updatedProfile);
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          <LinearGradient
            colors={[
              profile.gender === "Male" ? colors.teal : colors.pink,
              "#050505",
            ]}
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
              {city ? city : "Unknown Location"}
            </Text>
          </LinearGradient>
          <View className="mt-5 px-5">
            <View className="flex-row items-center mb-4">
              <Icon name="envelope" size={20} color={colors.black} />
              <Text className="ml-3 text-base text-gray-800">
                {profile.email}
              </Text>
            </View>

            <View className="flex-row items-center mb-4">
              <Icon name="calendar" size={20} color={colors.black} />
              <Text className="ml-3 text-base text-gray-800">
                Age: {profile.age}
              </Text>
            </View>

            <View className="flex-row items-center mb-4">
              <Icon name="info" size={20} color={colors.black} />
              <Text className="ml-5 text-base text-gray-800">
                Bio: {profile.bio}
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

            {/* Blocked users */}
            <TouchableOpacity onPress={() => setShowBlockedUsers(true)}>
              <View className="flex-row items-center mb-4">
                <Icon name="ban" size={20} color={colors.black} />
                <Text className="ml-3 text-base text-gray-800">
                  Blocked Users: {blockedUsers.length}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className={`mt-7 ${
              profile.gender === "Male" ? "bg-[#3eaba5]" : "bg-[#ffc0cb]"
            } py-4 mx-5 rounded-full items-center`}
            onPress={() => setEditing(true)}
          >
            <Text
              className={`${
                profile.gender === "Male" ? "text-white" : "text-gray-600"
              } text-lg font-bold`}
            >
              Edit Profile
            </Text>
          </TouchableOpacity>
          <SignOutButton />
          <DeleteAccount userId={profile.clerkId} />
        </>
      )}
    </ScrollView>
  );
};

export default ProfileData;
