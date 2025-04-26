import React, { useEffect, useState } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";
import { useAuthFetch } from "@/hooks/Privatefetch";
import { SafeAreaView } from "react-native-safe-area-context";
import { Profile } from "@/types";
import ProfileData from "@/components/profile/ProfileData";

import { Animated } from "react-native";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/utils/contants";
import Header from "@/components/header";
import RenderImageIndicators from "@/components/feed/RenderImageIndicators"; // Import the component
import ModernCard from "@/components/feed/ScrollableCard";
import Toast from "@/components/Toast";
import { useUser } from "@clerk/clerk-expo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Settings from "@/components/profile/Settings";

const ProfilePage = () => {
  const authFetch = useAuthFetch();
  const [profile, setProfile] = useState<Profile>();
  const [preview, setPreview] = useState(false);
  const [settings, setSettings] = useState(false);
  const { user } = useUser();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const position = new Animated.ValueXY();
  useEffect(() => {
    const fetchData = async () => {
      const response = await authFetch("/api/user/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response?.json();

      setProfile(data.updatedProfile);
    };

    fetchData();
  }, []);

  const handleImageTap = (tapX: number) => {
    const isRightTap = tapX > SCREEN_WIDTH / 2;

    if (isRightTap) {
      // Go to the next image if it's not the last one
      if (profile && currentImageIndex < profile.images.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      }
    } else {
      // Go to the previous image if it's not the first one
      if (currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
      }
    }
  };

  if (!profile) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-gray-500">Loading Profile...</Text>
      </SafeAreaView>
    );
  }

  if (settings) {
    return (
      <Settings profile={profile} setSettings={() => setSettings(!settings)} />
    );
  }

  return (
    <>
      <ProfileData
        profile={profile}
        setPreview={setPreview}
        setSettings={() => setSettings(!settings)}
      />
    </>
  );
};

export default ProfilePage;
