import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import { PanGestureHandler, ScrollView } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { Profile } from "@/types";
import RatingButtons from "@/components/feed/RateButtons";
import { Image } from "expo-image";

const SCREEN_WIDTH = Dimensions.get("window").width;

type Props = {
  user: Profile;
  currentImageIndex: number;
  onSwipe: (dir: "left" | "right") => void;
  rate: number | null;
  onRateChange: (n: number) => void;
  onImageTap?: (tapX: number) => void;
  isBackCard?: boolean;
};

export default function SwipeableCard({
  user,
  currentImageIndex,
  onSwipe,
  rate,
  onRateChange,
  onImageTap,
  isBackCard = false,
}: Props) {
  const translateX = useSharedValue(0);
  const [swipingDirection, setSwipingDirection] = useState<
    "left" | "right" | ""
  >("");

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;

      // Update swipe direction on the JS thread
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
    transform: [{ translateX: translateX.value }],
  }));

  useEffect(() => {
    if (user) {
      translateX.value = 0;
    }
  }, [user._id]);

  return (
    <PanGestureHandler onGestureEvent={gestureHandler} key={user._id}>
      <Animated.View
        key={user._id}
        style={[
          {
            position: "absolute",
            width: "100%",
            height: "85%",
            borderRadius: 16,
            overflow: "hidden",
            zIndex: isBackCard ? 0 : 10,
            transform: isBackCard ? [{ scale: 0.95 }] : [],
            opacity: isBackCard ? 0.8 : 1,
          },
        ]}
      >
        <MotiView
          from={{ opacity: 0.8, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 18, mass: 1 }}
          style={[{ flex: 1 }, animatedStyle]}
          key={user._id}
        >
          {/* YES / NOPE labels */}
          {swipingDirection === "right" && !isBackCard && (
            <Text
              className="absolute top-10 left-10 text-2xl z-10 text-white bg-green-400 p-1 font-bold"
              style={{ transform: [{ rotate: "20deg" }] }}
            >
              YES
            </Text>
          )}
          {swipingDirection === "left" && !isBackCard && (
            <Text
              className="absolute top-10 right-10 text-2xl z-10 text-white bg-red-400 p-1 font-bold"
              style={{ transform: [{ rotate: "-20deg" }] }}
            >
              NOPE
            </Text>
          )}

          <Pressable
            onPress={(e) => {
              if (!onImageTap) return;
              const tapX = e.nativeEvent.pageX;
              onImageTap(tapX);
            }}
            style={{ flex: 1 }}
          >
            <ImageBackground
              source={{ uri: user.images[currentImageIndex] }}
              className="w-full h-full bg-white"
              style={{ justifyContent: "flex-end" }}
            >
              {!isBackCard && (
                <View
                  style={{
                    position: "absolute",
                    bottom: 20,
                    left: 0,
                    right: 0,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 40,
                    zIndex: 10,
                  }}
                ></View>
              )}

              <LinearGradient
                colors={["rgba(0,0,0,0.01)", "rgba(0,0,0,0.8)"]}
                style={{ padding: 16 }}
              >
                <Text className="text-2xl font-bold text-white text-center">
                  {user.name}, {user.age}
                </Text>
                <Text className="text-lg text-gray-300 text-center">
                  {Math.floor(user.distance)} Miles away
                </Text>
              </LinearGradient>
            </ImageBackground>
          </Pressable>
        </MotiView>
      </Animated.View>
    </PanGestureHandler>
  );
}
