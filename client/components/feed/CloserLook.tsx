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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="h-[300px] w-full">
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

          {/* Average Rating */}
          {/* <View className="mb-4">
            <Text className="text-base text-gray-800">
              Average Rating:{" "}
              {profile.averageRating?.toFixed(1) || "No ratings yet"} ⭐
            </Text>
          </View> */}
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
