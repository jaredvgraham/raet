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
import Icon from "react-native-vector-icons/FontAwesome";

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
            style={{ flex: 1, overflow: "hidden" }}
            className="bg-gray-200  border-black border-4 rounded-xl"
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
                  style={{ height: SCREEN_HEIGHT * 0.6 }}
                >
                  <Image
                    source={{ uri: user.images[0] }}
                    className="w-full "
                    style={{ objectFit: "cover", height: "100%" }}
                    contentFit="cover"
                  />
                </View>
                {!isBackCard && (
                  <View className="absolute top-5 left-5 z-10">
                    <RingProgress percentage={user.matchScore} size={70} />
                  </View>
                )}
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,1)"]}
                  className="absolute bottom-0 px-6 pt-24 pb-1 w-full"
                >
                  <Text className="text-white text-3xl font-bold text-center">
                    {user.name.split(" ")[0]}, {user.age}
                  </Text>
                </LinearGradient>
              </View>

              {/* Interests */}
              <View className=" bg-black">
                <View className="flex-row items-center justify-center space-x-2 p-1">
                  <Icon name="map-marker" size={18} color="white" />
                  <Text className="text-base text-gray-300 font-medium">
                    {Math.floor(user.distance)} miles away
                  </Text>
                </View>

                <View className="w-full flex-row flex-wrap justify-center gap-2 mb-2 pb-7">
                  {user.interests?.length ? (
                    user.interests.map((interest) => (
                      <View
                        key={interest}
                        className="bg-gray-600 px-2 py-1 rounded-full"
                      >
                        <Text
                          key={interest}
                          className=" text-sm text-teal-400 font-bold"
                        >
                          {interest}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text className="text-gray-500">No interests listed</Text>
                  )}
                </View>
              </View>

              {/* Second Hero Image */}
              {user.images.length > 1 && (
                <View className="px-6 mt-6">
                  <Image
                    source={{ uri: user.images[1] }}
                    className="w-full h-52 rounded-xl"
                    contentFit="cover"
                  />
                </View>
              )}

              {/* Bio Section */}
              <View className="px-6 mt-6">
                <View className="flex-row items-center mb-1">
                  <Icon name="info-circle" size={16} color="#0f172a" />
                  <Text className="ml-2 text-gray-800 font-semibold text-base">
                    About Me
                  </Text>
                </View>
                <Text className="text-gray-700 text-sm">
                  {user.bio || "No bio yet."}
                </Text>
              </View>

              {/* Profile Fields */}
              <View className="px-6 mt-6 space-y-3">
                {user.jobTitle && (
                  <View className="flex-row items-center">
                    <Icon name="briefcase" size={16} color="#0f172a" />
                    <Text className="ml-3 text-sm text-gray-700">
                      <Text className="font-semibold">Job:</Text>{" "}
                      {user.jobTitle}
                    </Text>
                  </View>
                )}
                {user.relationshipType && (
                  <View className="flex-row items-center">
                    <Icon name="users" size={16} color="#0f172a" />
                    <Text className="ml-3 text-sm text-gray-700">
                      <Text className="font-semibold">Relationship Type:</Text>{" "}
                      {user.relationshipType}
                    </Text>
                  </View>
                )}
                {user.lookingFor && (
                  <View className="flex-row items-center">
                    <Icon name="heart" size={16} color="#0f172a" />
                    <Text className="ml-3 text-sm text-gray-700">
                      <Text className="font-semibold">Looking For:</Text>{" "}
                      {user.lookingFor}
                    </Text>
                  </View>
                )}
                {user.drinkingHabits && (
                  <View className="flex-row items-center">
                    <Icon name="glass" size={16} color="#0f172a" />
                    <Text className="ml-3 text-sm text-gray-700">
                      <Text className="font-semibold">Drinks:</Text>{" "}
                      {user.drinkingHabits}
                    </Text>
                  </View>
                )}
                {user.smokingHabits && (
                  <View className="flex-row items-center">
                    <Icon name="fire" size={16} color="#0f172a" />
                    <Text className="ml-3 text-sm text-gray-700">
                      <Text className="font-semibold">Smokes:</Text>{" "}
                      {user.smokingHabits}
                    </Text>
                  </View>
                )}
                {user.pets?.length > 0 && (
                  <View className="flex-row items-center">
                    <Icon name="paw" size={16} color="#0f172a" />
                    <Text className="ml-3 text-sm text-gray-700">
                      <Text className="font-semibold">Pets:</Text>{" "}
                      {user.pets.join(", ")}
                    </Text>
                  </View>
                )}
                {user.socialMedia?.instagram && (
                  <View className="flex-row items-center">
                    <Icon name="instagram" size={16} color="#0f172a" />
                    <Text className="ml-3 text-sm text-gray-700">
                      <Text className="font-semibold">Instagram:</Text> @
                      {user.socialMedia.instagram.split("@")[1]}
                    </Text>
                  </View>
                )}
              </View>

              {/* Additional Images Grid */}
              {user.images.length > 2 && (
                <View className="px-6 mt-8">
                  <Text className="text-base font-semibold text-gray-800 mb-3">
                    More Photos
                  </Text>
                  <View className="flex-row flex-wrap justify-between gap-3">
                    {user.images.slice(2).map((img, idx) => (
                      <Image
                        key={idx}
                        source={{ uri: img }}
                        className="w-[47%] h-44 rounded-xl"
                        contentFit="cover"
                      />
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>
            {/* Rating Buttons */}
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
