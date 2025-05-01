import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
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
import PostCard from "./posts/PostCard";
import RenderImageIndicators from "./RenderImageIndicators";
import * as Haptics from "expo-haptics";
import UserActionsMenu from "../UserActionsMenu";

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
    console.log(`user on card`, user);

    const translateX = useSharedValue(0);
    const [swipingDirection, setSwipingDirection] = useState<
      "left" | "right" | ""
    >("");
    const { rate, setRate } = useSwipeFeed();
    const [isSwiping, setIsSwiping] = useState(false);
    const [imgIndex, setImgIndex] = useState(0);

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
      if (user) {
        translateX.value = 0;
      }
    }, [user._id]);

    const handleImgClick = (event: any) => {
      const x = event.nativeEvent.locationX;
      Haptics.selectionAsync();
      if (x < SCREEN_WIDTH / 2) {
        // Tapped left

        setImgIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else {
        // Tapped right
        if (imgIndex >= user.images.length - 1) {
          setImgIndex(0);
        } else {
          setImgIndex((prev) =>
            prev < user.images.length - 1 ? prev + 1 : prev
          );
        }
      }
    };

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
              <TouchableWithoutFeedback onPressIn={handleImgClick}>
                <View className="relative">
                  <RenderImageIndicators
                    images={user.images}
                    currentImageIndex={imgIndex}
                  />
                  <View className="absolute top-3 right-5 z-50">
                    <UserActionsMenu
                      reportedUserId={user.clerkId}
                      color="white"
                    />
                  </View>

                  <View
                    style={{ height: SCREEN_HEIGHT * 0.6 }}
                    className="w-full"
                  >
                    <Image
                      source={{ uri: user.images[imgIndex] }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />
                  </View>

                  {!isBackCard && (
                    <View className="absolute top-5 left-5 z-10">
                      <RingProgress
                        percentage={user.matchScore || 98}
                        size={70}
                      />
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
              </TouchableWithoutFeedback>

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
                        className="bg-teal-100 px-3 py-1 rounded-full"
                      >
                        <Text className="text-sm font-medium text-teal-600">
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
              {user.images && (
                <View className="px-6 mt-6">
                  <Image
                    source={{ uri: user.images[0] }}
                    className="w-full h-72 rounded-xl"
                    contentFit="cover"
                  />
                </View>
              )}

              {/* Bio Section */}
              <View className="px-6 mt-6">
                <View className="flex-row items-center mb-1"></View>
                <Text className="text-gray-700 text-lg italic">
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
                    <Icon name="users" size={16} color="#c93bf5" />
                    <Text className="ml-3 text-sm text-gray-700">
                      <Text className="font-semibold">Relationship Type:</Text>{" "}
                      {user.relationshipType}
                    </Text>
                  </View>
                )}
                {user.lookingFor && (
                  <View className="flex-row items-center">
                    <Icon name="heart" size={16} color="#f53b3b" />
                    <Text className="ml-3 text-sm text-gray-700">
                      <Text className="font-semibold">Looking For:</Text>{" "}
                      {user.lookingFor}
                    </Text>
                  </View>
                )}
                {user.drinkingHabits && (
                  <View className="flex-row items-center">
                    <Icon name="glass" size={16} color="#ed9726" />
                    <Text className="ml-3 text-sm text-gray-700">
                      <Text className="font-semibold">Drinks:</Text>{" "}
                      {user.drinkingHabits}
                    </Text>
                  </View>
                )}
                {user.smokingHabits && (
                  <View className="flex-row items-center">
                    <Icon name="fire" size={16} color="#3bccf5" />
                    <Text className="ml-3 text-sm text-gray-700">
                      <Text className="font-semibold">Smokes:</Text>{" "}
                      {user.smokingHabits}
                    </Text>
                  </View>
                )}
                {user.pets && user.pets.length > 0 && (
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
                      <Text className="font-semibold">Instagram:</Text>
                      {user.socialMedia.instagram.includes("@")
                        ? `@${user.socialMedia.instagram.split("@")[1]}`
                        : `@${user.socialMedia.instagram}`}
                    </Text>
                  </View>
                )}
              </View>

              {/* Recent Posts */}
              {user.recentPosts?.length > 0 && (
                <>
                  <View className="px-6 mt-8">
                    <Text className="text-base font-semibold text-gray-800 mb-3">
                      Recent Posts
                    </Text>
                  </View>
                  {user.recentPosts.map((post) => (
                    <View className="mt-2" key={post._id}>
                      <PostCard post={post} commentsDisabled />
                    </View>
                  ))}
                </>
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
