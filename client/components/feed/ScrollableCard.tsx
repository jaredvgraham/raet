import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
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
import RatingButtons from "./RateButtons";
import { useSwipeFeed } from "@/hooks/useSwipeFeed";

const SCREEN_WIDTH = Dimensions.get("window").width;

export type ModernCardRef = {
  swipe: (dir: "left" | "right") => void;
};

type Props = {
  user: Profile;
  onSwipe: (dir: "left" | "right") => void;
  isBackCard?: boolean;
};

const ModernCard = forwardRef<ModernCardRef, Props>(
  ({ user, onSwipe, isBackCard = false }, ref) => {
    const translateX = useSharedValue(0);
    const [swipingDirection, setSwipingDirection] = useState<
      "left" | "right" | ""
    >("");
    const { rate, setRate } = useSwipeFeed();
    const [isSwiping, setIsSwiping] = useState(false);

    useImperativeHandle(ref, () => ({
      swipe: (dir: "left" | "right") => {
        setSwipingDirection(dir);
        translateX.value = withSpring(
          dir === "left" ? -SCREEN_WIDTH - 150 : SCREEN_WIDTH + 150,
          {},
          () => runOnJS(onSwipe)(dir)
        );
      },
    }));

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
        { rotate: `${translateX.value / 20}deg` },
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
          className="absolute w-full h-full rounded-xl overflow-hidden shadow-2xl   "
          style={[animatedStyle, { zIndex: isBackCard ? 0 : 10 }]}
        >
          <MotiView
            from={{ opacity: 0.8, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 18, mass: 1 }}
            style={{ flex: 1, backgroundColor: "black", overflow: "hidden" }}
          >
            {swipingDirection === "left" && (
              <>
                <View className="absolute top-0 left-0 w-full h-full bg-red-500 opacity-20 z-20" />
                <View className="absolute top-0 left-0 w-full h-full items-center justify-center z-30">
                  <Text className="text-white text-4xl font-bold">NOPE</Text>
                </View>
              </>
            )}
            {swipingDirection === "right" && (
              <>
                <View className="absolute top-0 left-0 w-full h-full bg-green-500 opacity-20 z-20" />
                <View className="absolute top-0 left-0 w-full h-full items-center justify-center z-30">
                  <Text className="text-white text-4xl font-bold">YES</Text>
                </View>
              </>
            )}

            {/* Main Content */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 150 }}
              className="w-full h-full"
            >
              {/* Hero Image */}
              <View className="relative">
                <View
                  className="w-full "
                  style={{ height: SCREEN_HEIGHT * 0.63 }}
                >
                  <Image
                    source={{ uri: user.images[0] }}
                    className="w-full "
                    style={{ objectFit: "cover", height: "100%" }}
                    contentFit="cover"
                  />
                </View>

                <View className="absolute top-5 left-5 z-10">
                  <RingProgress percentage={88} size={70} />
                </View>

                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,1)"]}
                  className="absolute bottom-0 px-6 pt-24 pb-1 w-full"
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
                <Text className="text-lg text-gray-300 font-semibold mb-2 mr-2">
                  Interests
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {user.interests?.length ? (
                    user.interests.map((interest) => (
                      <View
                        key={interest}
                        className="bg-teal-200/50 px-2 py-1 rounded-full"
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
                <Text className="text-lg text-gray-300 font-semibold mb-2">
                  About Me
                </Text>
                <Text className="text-gray-300">
                  {user.bio || "No bio yet."}
                </Text>
              </View>
            </ScrollView>

            <View className="bg-black w-full items-center  px-1 absolute bottom-0 z-50 ">
              <RatingButtons
                rate={rate}
                onRateChange={setRate}
                isCurrentCard={!isBackCard}
              />
            </View>
          </MotiView>
        </Animated.View>
      </PanGestureHandler>
    );
  }
);

export default ModernCard;
