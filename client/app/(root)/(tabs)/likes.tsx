import { View, Text, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { Profile } from "@/types";
import { useAuthFetch } from "@/hooks/Privatefetch";
import { Image } from "expo-image";
import { TouchableOpacity } from "react-native";
import UserDetailScreen from "@/components/feed/CloserLook";
import Header from "@/components/header";
import { set } from "firebase/database";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons"; // Optional for lock icon
import { StyleSheet } from "react-native";

const LikesPage = () => {
  const [likes, setLikes] = useState<Profile[]>([]);
  const [moreDetails, setMoreDetails] = useState<boolean>(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const { user } = useUser();

  const authFetch = useAuthFetch();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      console.log("fetching likes");
      try {
        const response = await authFetch("/api/user/likes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response?.json();
        console.log("data", data);

        console.log("likes", data.likes);

        setLikes(data.likes);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchData();
  }, []);

  const handleDetailsClick = (profile: Profile) => {
    setSelectedProfile(profile);
    setMoreDetails(true);
  };

  const sendRight = async () => {
    try {
      const res = await authFetch("/api/feed/swipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          swipedId: selectedProfile?.clerkId,
          direction: "right",
        }),
      });
      const data = await res?.json();
      console.log("res", data);

      setSelectedProfile(null);
    } catch (error) {
      console.log("error", error);
    }
  };

  const sendLeft = () => {
    try {
      authFetch("/api/feed/swipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          swipedId: selectedProfile?.clerkId,
          direction: "left",
        }),
      });
      setSelectedProfile(null);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      {moreDetails && selectedProfile ? (
        <UserDetailScreen
          profile={selectedProfile}
          onClose={setMoreDetails}
          onSwipeLeft={() => {
            setMoreDetails(false);
            sendLeft();
          }}
          onSwipeRight={() => {
            setMoreDetails(false);
            sendRight();
          }}
        />
      ) : (
        <SafeAreaView className="flex-1 bg-white">
          <Header style="w-full flex items-center justify-center" />
          <Text className="text-lg text-center text-gray-500 mb-4">
            These Users like you
          </Text>
          <View className="flex-1 flex-wrap flex-row justify-between p-2">
            {likes.length > 0 ? (
              likes.map((like, index) => (
                <TouchableOpacity
                  onPress={() => {
                    user?.publicMetadata.plan !== "none"
                      ? handleDetailsClick(like)
                      : router.push("/(root)/(pay)/plans");
                  }}
                  key={like._id}
                  className="w-[48%] mb-4"
                  style={{
                    // Adjust the width to ensure 2 items per row
                    width: "48%",
                  }}
                >
                  <Image
                    source={{ uri: like.images[0] }}
                    style={{ width: "100%", height: 150 }}
                    className="rounded-lg"
                  />
                  {user?.publicMetadata.plan === "none" && (
                    <BlurView
                      intensity={50}
                      tint="light"
                      style={{
                        ...StyleSheet.absoluteFillObject,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name="lock-closed-outline"
                        size={30}
                        color="white"
                      />
                      <Text className="text-xs text-white mt-1">
                        Upgrade to unlock
                      </Text>
                    </BlurView>
                  )}
                  <Text className="absolute z-10 bottom-0 p-2 bg-black mt-2 text-white">
                    {like.name.split(" ")[0]}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text>No likes yet</Text>
                <Text className="text-gray-500">
                  Start swiping to get likes!
                </Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

export default LikesPage;
