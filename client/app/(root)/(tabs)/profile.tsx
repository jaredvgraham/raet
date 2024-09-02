import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { useAuthFetch } from "@/hooks/Privatefetch";

import { SafeAreaView } from "react-native-safe-area-context";

import { Profile } from "@/types";

import ProfileData from "@/components/profile/ProfileData";

const ProfilePage = () => {
  const authFetch = useAuthFetch();
  const [profile, setProfile] = useState<Profile>();
  const [preview, setPreview] = useState(false);

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

  if (!profile) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-gray-500">Loading Profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      {preview ? (
        <SafeAreaView className="flex-1 bg-gray-100">
          <Text>Preview</Text>
        </SafeAreaView>
      ) : (
        <SafeAreaView className="flex-1 bg-gray-100">
          <ProfileData profile={profile} setPreview={setPreview} />
        </SafeAreaView>
      )}
    </>
  );
};

export default ProfilePage;
