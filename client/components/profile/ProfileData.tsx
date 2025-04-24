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
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ProfileScreen from "./ProfileScreen";

type ProfileDataProps = {
  profile: Profile;
  setPreview: React.Dispatch<React.SetStateAction<boolean>>;
  setSettings?: () => void;
};

const ProfileData = ({
  profile,
  setPreview,
  setSettings,
}: ProfileDataProps) => {
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
    <SafeAreaView className="flex-1 relative  bg-white">
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
        <ProfileScreen
          profile={profile}
          setPreview={setPreview}
          setEditing={() => setEditing(!editing)}
          city={city as string}
          blockedUsers={blockedUsers}
          setShowBlockedUsers={() => setShowBlockedUsers(true)}
          setSettings={setSettings || (() => {})}
        />
      )}
    </SafeAreaView>
  );
};

export default ProfileData;
