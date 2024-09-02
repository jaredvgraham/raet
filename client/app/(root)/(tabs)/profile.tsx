import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuthFetch } from "@/hooks/Privatefetch";
import { SafeAreaView } from "react-native-safe-area-context";
import { Profile } from "@/types";
import ProfileData from "@/components/profile/ProfileData";
import SwipeableCard from "@/components/feed/SwipeableCard";
import { Animated } from "react-native"; // Required for animation
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/utils/contants";
import Header from "@/components/header";
import RenderImageIndicators from "@/components/feed/RenderImageIndicators"; // Import the component

const ProfilePage = () => {
  const authFetch = useAuthFetch();
  const [profile, setProfile] = useState<Profile>();
  const [preview, setPreview] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const position = new Animated.ValueXY(); // Initialize the animation position

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

  return (
    <>
      {preview ? (
        <SafeAreaView className="flex-1 bg-white items-center ">
          <Header />
          <TouchableOpacity
            className="absolute top-20 left-3 z-30 bg-black p-2 rounded-full"
            onPress={() => setPreview(false)}
          >
            <Text className="text-lg text-gray-200">Done</Text>
          </TouchableOpacity>

          <View
            className="relative  rounded-lg shadow-2xl  items-center"
            style={{
              width: SCREEN_WIDTH - 0.4,
              height: SCREEN_HEIGHT * 0.7,
            }}
            onStartShouldSetResponder={(event) => true}
            onResponderRelease={(event) => {
              handleImageTap(event.nativeEvent.locationX);
            }}
          >
            <SwipeableCard
              user={profile}
              isCurrentCard={true} // Since it's a preview, we want to treat it as the current card
              index={0}
              swipingDirection={""}
              position={position}
              panHandlers={{}} // No panHandlers needed in preview mode
              currentImageIndex={currentImageIndex} // Pass the current image index
              onSwipeRight={() => {}} // No swipe actions in preview mode
              onSwipeLeft={() => {}} // No swipe actions in preview mode
              onRateChange={() => {}} // No rating in preview mode
              rate={null}
              RenderImageIndicators={() => (
                <RenderImageIndicators
                  images={profile.images}
                  currentImageIndex={currentImageIndex}
                />
              )}
            />
          </View>
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
