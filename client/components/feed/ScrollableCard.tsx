import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { MotiView } from "moti";
import { Profile } from "@/types";
import RingProgress from "./RingProgress";
import { SCREEN_HEIGHT } from "@/utils/contants";

const SCREEN_WIDTH = Dimensions.get("window").width;

type Props = {
  user: Profile;
  onSwipe: (dir: "left" | "right") => void;
  isBackCard?: boolean;
};

export default function ModernCard({
  user,
  onSwipe,
  isBackCard = false,
}: Props) {
  const translateX = useSharedValue(0);
  const [swipingDirection, setSwipingDirection] = useState<
    "left" | "right" | ""
  >("");

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
      if (event.translationX > 30) {
        runOnJS(setSwipingDirection)("right");
      } else if (event.translationX < -30) {
        runOnJS(setSwipingDirection)("left");
      } else {
        runOnJS(setSwipingDirection)("");
      }
    },
    onEnd: (event) => {
      if (event.translationX > 100) {
        translateX.value = withSpring(SCREEN_WIDTH + 100);
        runOnJS(onSwipe)("right");
      } else if (event.translationX < -100) {
        translateX.value = withSpring(-SCREEN_WIDTH - 100);
        runOnJS(onSwipe)("left");
      } else {
        translateX.value = withSpring(0);
        runOnJS(setSwipingDirection)("");
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      ...(isBackCard ? [{ scale: 0.95 }] : []),
    ],
    opacity: isBackCard ? 0.8 : 1,
  }));

  useEffect(() => {
    translateX.value = 0;
  }, [user._id]);

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View
        className="absolute w-full h-[84%] rounded-xl overflow-hidden bg-slate-50 border border-gray-300 "
        style={[animatedStyle, { zIndex: isBackCard ? 0 : 10 }]}
      >
        <MotiView
          from={{ opacity: 0, translateY: 40 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="flex-1"
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 150 }}
            className="w-full h-full"
          >
            {/* Hero Image */}
            <View className="relative">
              <View className="w-full " style={{ height: SCREEN_HEIGHT * 0.6 }}>
                <Image
                  source={{ uri: user.images[0] }}
                  className="w-full "
                  style={{ objectFit: "cover", height: "100%" }}
                  contentFit="cover"
                />
              </View>

              <View className="absolute top-5 left-5 z-10">
                <RingProgress percentage={87} size={70} />
              </View>

              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                className="absolute bottom-0 px-6 pt-24 pb-6 w-full"
              >
                <Text className="text-white text-3xl font-bold text-center">
                  {user.name.split(" ")[0]}, {user.age}
                </Text>
                <Text className="text-gray-300 text-base mt-1 text-center">
                  {Math.floor(user.distance)} miles away
                </Text>
              </LinearGradient>
            </View>
            {/* Interests */}
            <View className="px-6 mt-6 flex flex-row">
              <Text className="text-lg text-black font-semibold mb-2 mr-2">
                Interests
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {user.interests?.length ? (
                  user.interests.map((interest) => (
                    <View
                      key={interest}
                      className="bg-black px-2 py-1 rounded-full"
                    >
                      <Text key={interest} className=" text-sm text-gray-300">
                        {interest}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text className="text-gray-500">No interests listed</Text>
                )}
              </View>
            </View>

            {/* Extra Images */}
            {user.images.length > 1 && (
              <ScrollView
                horizontal
                className="mt-5 px-5"
                showsHorizontalScrollIndicator={false}
              >
                {user.images.slice(1).map((img, idx) => (
                  <Image
                    key={idx}
                    source={{ uri: img }}
                    className="w-32 h-48 rounded-xl mr-4"
                    contentFit="cover"
                  />
                ))}
              </ScrollView>
            )}

            {/* Bio */}
            <View className="px-6 mt-6">
              <Text className="text-lg text-black font-semibold mb-2">
                About Me
              </Text>
              <Text className="text-gray-700">{user.bio || "No bio yet."}</Text>
            </View>
          </ScrollView>
        </MotiView>
      </Animated.View>
    </PanGestureHandler>
  );
}
