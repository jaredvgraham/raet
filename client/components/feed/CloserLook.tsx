import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";
import { Profile } from "@/types";
import Icon from "react-native-vector-icons/FontAwesome";
import UserActionsMenu from "../UserActionsMenu";
import PostCard from "./posts/PostCard";

type UserDetailScreenProps = {
  profile: Profile;
  onClose: (value: boolean) => void;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  showButtons?: boolean;
};

const SCREEN_WIDTH = Dimensions.get("window").width;

const UserDetailScreen = ({
  profile,
  onClose,
  onSwipeRight,
  onSwipeLeft,
  showButtons = true,
}: UserDetailScreenProps) => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  console.log("Profile data:", profile);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="h-[500px] w-full">
          <Swiper
            ref={swiperRef}
            loop={false}
            dot={<View className="w-[8px] h-2 bg-gray-300 rounded-full mx-1" />}
            activeDot={
              <View className="w-[8px] h-2 bg-black rounded-full mx-1" />
            }
            onIndexChanged={(index) => setActiveIndex(index)}
          >
            {profile.images.map((image, index) => (
              <View key={index} className="h-full w-full">
                <Image
                  source={{ uri: image }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </View>
            ))}
          </Swiper>

          {showButtons && (
            <>
              <TouchableOpacity
                className="absolute bottom-5 left-5 bg-gray-100 p-1 rounded-full w-10 h-10"
                onPress={() => onSwipeLeft()}
              >
                <Image
                  className="w-full h-full"
                  source={require("../../assets/images/dislike.png")}
                />
              </TouchableOpacity>

              <TouchableOpacity
                className="absolute bottom-5 right-5 bg-gray-100 p-1 rounded-full w-10 h-10"
                onPress={() => onSwipeRight()}
              >
                <Image
                  className="w-full h-full"
                  source={require("../../assets/images/like.png")}
                />
              </TouchableOpacity>
            </>
          )}
        </View>

        <View className="p-5">
          {/* Bio */}
          <View className="mb-2">
            <Text className="text-2xl font-bold text-gray-800 ">
              {profile.name}, {profile.age}
            </Text>
            <Text className="text-base text-gray-800">{profile.bio}</Text>
          </View>

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <View className="mb-4">
              <Text className="text-base font-bold text-gray-800 mb-2">
                Interests
              </Text>
              <View className="flex-row flex-wrap">
                {profile.interests.map((interest, index) => (
                  <View
                    key={index}
                    className="px-4 py-2 mr-2 mb-2 rounded-full bg-black"
                  >
                    <Text className="text-white">{interest}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Distance */}
          <View className="mb-4">
            <Text className="text-base text-gray-800">
              Distance: {Math.floor(profile.distance)} miles away
            </Text>
          </View>

          {profile.jobTitle && (
            <View className="flex-row items-center mb-2">
              <Icon name="briefcase" size={16} color="#0f172a" />
              <Text className="ml-3 text-sm text-gray-700">
                <Text className="font-semibold">Job:</Text> {profile.jobTitle}
              </Text>
            </View>
          )}

          {profile.relationshipType && (
            <View className="flex-row items-center mb-2">
              <Icon name="users" size={16} color="#c93bf5" />
              <Text className="ml-3 text-sm text-gray-700">
                <Text className="font-semibold">Relationship Type:</Text>{" "}
                {profile.relationshipType}
              </Text>
            </View>
          )}

          {profile.lookingFor && (
            <View className="flex-row items-center mb-2">
              <Icon name="heart" size={16} color="#f53b3b" />
              <Text className="ml-3 text-sm text-gray-700">
                <Text className="font-semibold">Looking For:</Text>{" "}
                {profile.lookingFor}
              </Text>
            </View>
          )}

          {profile.drinkingHabits && (
            <View className="flex-row items-center mb-2">
              <Icon name="glass" size={16} color="#ed9726" />
              <Text className="ml-3 text-sm text-gray-700">
                <Text className="font-semibold">Drinks:</Text>{" "}
                {profile.drinkingHabits}
              </Text>
            </View>
          )}

          {profile.smokingHabits && (
            <View className="flex-row items-center mb-2">
              <Icon name="fire" size={16} color="#3bccf5" />
              <Text className="ml-3 text-sm text-gray-700">
                <Text className="font-semibold">Smokes:</Text>{" "}
                {profile.smokingHabits}
              </Text>
            </View>
          )}

          {profile.pets && profile.pets.length > 0 && (
            <View className="flex-row items-center mb-2">
              <Icon name="paw" size={16} color="#0f172a" />
              <Text className="ml-3 text-sm text-gray-700">
                <Text className="font-semibold">Pets:</Text>{" "}
                {profile.pets.join(", ")}
              </Text>
            </View>
          )}

          {profile.socialMedia?.instagram && (
            <View className="flex-row items-center mb-2">
              <Icon name="instagram" size={16} color="#0f172a" />
              <Text className="ml-3 text-sm text-gray-700">
                <Text className="font-semibold">Instagram:</Text>{" "}
                {profile.socialMedia.instagram.includes("@")
                  ? `@${profile.socialMedia.instagram.split("@")[1]}`
                  : `@${profile.socialMedia.instagram}`}
              </Text>
            </View>
          )}

          {/* Average Rating */}
          {/* <View className="mb-4">
            <Text className="text-base text-gray-800">
              Average Rating:{" "}
              {profile.averageRating?.toFixed(1) || "No ratings yet"} ⭐
            </Text>
          </View> */}
        </View>

        {/* User's postsn */}
        <View className="mb-4">
          <Text className="text-base font-bold text-gray-800 mb-2 ml-4">
            User's Posts
          </Text>

          {profile.recentPosts &&
            profile.recentPosts.map((post, index) => (
              <PostCard key={index} post={post} commentsDisabled />
            ))}
        </View>

        {/* Close Button */}
        <TouchableOpacity
          className="absolute top-5 right-5 bg-gray-100 p-3 rounded-full"
          onPress={() => onClose(false)}
        >
          <Icon name="times" size={24} color="#000" />
        </TouchableOpacity>

        {/* Actions Menu */}
        <View className="absolute top-5 left-5">
          <UserActionsMenu reportedUserId={profile.clerkId} color="white" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserDetailScreen;
