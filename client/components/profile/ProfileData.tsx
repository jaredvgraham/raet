import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image as RNImage,
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

      // Basic fields
      formData.append("name", updatedProfile.name);
      if (updatedProfile.bio) formData.append("bio", updatedProfile.bio);
      if (updatedProfile.jobTitle)
        formData.append("jobTitle", updatedProfile.jobTitle);
      if (updatedProfile.relationshipType)
        formData.append("relationshipType", updatedProfile.relationshipType);
      if (updatedProfile.lookingFor)
        formData.append("lookingFor", updatedProfile.lookingFor);
      if (updatedProfile.drinkingHabits)
        formData.append("drinkingHabits", updatedProfile.drinkingHabits);
      if (updatedProfile.smokingHabits)
        formData.append("smokingHabits", updatedProfile.smokingHabits);

      // Array fields
      if (updatedProfile.pets?.length) {
        formData.append("pets", updatedProfile.pets.join(","));
      }

      if (updatedProfile.interests?.length) {
        formData.append("interests", updatedProfile.interests.join(","));
      }

      if (updatedProfile.preferredAgeRange?.length === 2) {
        formData.append(
          "preferredAgeRange",
          updatedProfile.preferredAgeRange.join(",")
        );
      }

      // Social media
      if (updatedProfile.socialMedia?.instagram) {
        formData.append("instagram", updatedProfile.socialMedia.instagram);
      }

      // Gender preference & distance
      formData.append("preferredGender", updatedProfile.preferredGender);
      formData.append("maxDistance", updatedProfile.maxDistance.toString());

      // Images
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
    <ScrollView className="bg-white flex-1  ">
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
              profile.gender === "Male" ? colors.teal : "#f9c2d6",
              "#ffffff",
            ]}
            className="items-center py-6 px-4 rounded-b-3xl border-b border-gray-200"
          >
            {profile.images?.[0] ? (
              <>
                <TouchableOpacity
                  className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md"
                  onPress={() => setPreview(true)}
                >
                  <Text className="text-sm font-medium text-gray-800">
                    Preview
                  </Text>
                </TouchableOpacity>
                <RNImage
                  source={{ uri: profile.images[0] }}
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: 70,
                    borderWidth: 4,
                    borderColor: "#fff",
                  }}
                />
              </>
            ) : (
              <Text className="text-4xl text-white">No Image</Text>
            )}
            <Text className="mt-3 text-2xl font-bold text-gray-900">
              {profile.name}
            </Text>
            <Text className="text-gray-600 text-sm">
              {profile.jobTitle || ""}
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              {city || "Unknown Location"}
            </Text>
          </LinearGradient>

          <ScrollView className="mt-6 px-5">
            {[
              {
                icon: "envelope",
                label: profile.email,
              },
              {
                icon: "calendar",
                label: `Age: ${profile.age}`,
              },
              {
                icon: "info-circle",
                label: profile.bio || "",
              },
              {
                icon: "venus-mars",
                label: `Gender: ${profile.gender}`,
              },
              {
                icon: "star",
                label: `Interests: ${profile.interests?.join(", ") || "None"}`,
              },
              {
                icon: "search",
                label: `Preferred Gender: ${profile.preferredGender}`,
              },
              {
                icon: "calendar-check-o",
                label: `Preferred Age: ${profile.preferredAgeRange?.join(
                  " - "
                )}`,
              },
              {
                icon: "heart",
                label: `Looking For: ${profile.lookingFor || "N/A"}`,
              },
              {
                icon: "users",
                label: `Relationship Type: ${
                  profile.relationshipType || "N/A"
                }`,
              },
              {
                icon: "glass",
                label: `Drinking: ${profile.drinkingHabits || "N/A"}`,
              },
              {
                icon: "fire",
                label: `Smoking: ${profile.smokingHabits || "N/A"}`,
              },
              {
                icon: "paw",
                label:
                  profile.pets?.length > 0
                    ? `Pets: ${profile.pets.join(", ")}`
                    : "No pets listed",
              },
              {
                icon: "instagram",
                label: profile.socialMedia?.instagram
                  ? `@${profile.socialMedia.instagram}`
                  : "Instagram not linked",
              },
              {
                icon: "map-marker",
                label: `Max Distance: ${profile.maxDistance} miles`,
              },
              {
                icon: "heart-o",
                label: `Matches: ${profile.matchedUsers?.length || 0}`,
              },
            ].map((item, index) => (
              <View key={index} className="flex-row items-center mb-4">
                <Icon name={item.icon} size={18} color={colors.black} />
                <Text className="ml-3 text-base text-gray-800">
                  {item.label}
                </Text>
              </View>
            ))}

            {/* Blocked Users */}
            <TouchableOpacity onPress={() => setShowBlockedUsers(true)}>
              <View className="flex-row items-center mb-6">
                <Icon name="ban" size={20} color={colors.black} />
                <Text className="ml-3 text-base text-gray-800">
                  Blocked Users: {blockedUsers.length}
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>

          {/* Edit Button */}
          <TouchableOpacity
            className={`mt-4 mx-5 py-4 rounded-full items-center shadow-md ${
              profile.gender === "Male" ? "bg-[#14b8a6]" : "bg-pink-400"
            }`}
            onPress={() => setEditing(true)}
          >
            <Text
              className={`text-lg font-semibold ${
                profile.gender === "Male" ? "text-white" : "text-white"
              }`}
            >
              Edit Profile
            </Text>
          </TouchableOpacity>

          {/* Auth Buttons */}
          <View className="mt-5 px-5">
            <SignOutButton />
            <DeleteAccount userId={profile.clerkId} />
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default ProfileData;
