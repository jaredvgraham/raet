import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import ModernCard, { ModernCardRef } from "@/components/feed/ScrollableCard";
import { useAuthFetch } from "@/hooks/Privatefetch";
import { useUser } from "@clerk/clerk-expo";
import { Profile } from "@/types";
import { useSwipeFeed } from "@/hooks/useSwipeFeed";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Header from "@/components/header";
import Icon from "react-native-vector-icons/FontAwesome";

const viewUser = () => {
  const { userId } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const authFetch = useAuthFetch();
  const [isUser, setIsUser] = React.useState(false);
  const { user } = useUser();
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const { handleSwipe, setProfiles } = useSwipeFeed();

  const cardRef = useRef<ModernCardRef>(null);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    setIsUser(userId === user?.id);

    const fetchUserProfile = async () => {
      try {
        const response = await authFetch(`/api/user/profile/${userId}`);
        const data = await response.json();
        console.log("User profile data:", data);
        const userProfile = {
          ...data.updatedProfile,
          recentPosts: data.updatedProfile.posts,
        };
        setProfile(userProfile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (userId) fetchUserProfile();
  }, [userId, user]);

  const onSwipe = (dir: "left" | "right") => {
    console.log("swipe", dir);

    if (isUser) {
      router.back();
      return;
    }
    handleSwipe(profile as Profile, dir, true);
    router.back();
  };
  const triggerSwipe = (dir: "left" | "right") => {
    cardRef.current?.swipe(dir);
  };
  return (
    <SafeAreaView className="flex-1 justify-center bg-white relative   ">
      <Header backArrow />
      {profile && (
        <>
          <View className="flex-1 w-full items-center relative  rounded-xl pb-1">
            <ModernCard user={profile} onSwipe={onSwipe} ref={cardRef} />
          </View>
          <View className="absolute bottom-48 right-3 gap-3">
            <TouchableOpacity
              onPress={() => triggerSwipe("right")}
              style={{
                backgroundColor: "rgba(0, 0, 0, 1.5)",
                borderColor: "rgb(82, 204, 43)", // ✅ green border with opacity
                borderWidth: 2,
                borderRadius: 999,
                padding: 12,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="heart" size={40} color="rgb(82, 204, 43)" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => triggerSwipe("left")}
              style={{
                backgroundColor: "rgba(0, 0, 0, 1.5)",
                borderColor: "rgb(239, 68, 68)", // Tailwind red-500
                borderWidth: 2,
                borderRadius: 999,
                padding: 12,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="times" size={40} color="rgb(239, 68, 68)" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default viewUser;
