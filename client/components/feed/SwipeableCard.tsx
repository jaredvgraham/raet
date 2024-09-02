// components/SwipeableCard.tsx

import React from "react";
import {
  View,
  Text,
  Image,
  Animated,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Profile } from "@/types";
import RatingButtons from "@/components/feed/RateButtons";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

type SwipeableCardProps = {
  user: Profile;
  isCurrentCard: boolean;
  index: number;
  swipingDirection: string;
  position: Animated.ValueXY;
  panHandlers: any;
  currentImageIndex: number;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
  onRateChange: (number: number) => void;
  rate: number | null;
  RenderImageIndicators: React.FC;
};

const SwipeableCard = ({
  user,
  isCurrentCard,
  index,
  swipingDirection,
  position,
  panHandlers,
  currentImageIndex,
  onSwipeRight,
  onSwipeLeft,
  onRateChange,
  rate,
  RenderImageIndicators,
}: SwipeableCardProps) => {
  return (
    <Animated.View
      key={user._id}
      {...(isCurrentCard ? panHandlers : {})}
      style={[
        {
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: -index, // Or any other logic to determine zIndex
        },
        isCurrentCard && position.getLayout(),
      ]}
    >
      {isCurrentCard && swipingDirection === "right" && (
        <Text
          className="absolute top-10 left-10 text-2xl z-10 text-white bg-green-400 p-1 font-bold"
          style={{
            transform: [{ rotate: "20deg" }],
          }}
        >
          YES
        </Text>
      )}
      {isCurrentCard && swipingDirection === "left" && (
        <Text
          className="absolute top-10 right-10 text-2xl z-10 text-white bg-red-400 p-1 font-bold"
          style={{
            transform: [{ rotate: "-20deg" }],
          }}
        >
          NOPE
        </Text>
      )}
      <ImageBackground
        source={{ uri: user.images[currentImageIndex] }}
        className="w-full h-full overflow-hidden rounded-t-2xl bg-white"
        style={{ justifyContent: "flex-end" }}
      >
        {isCurrentCard && <RenderImageIndicators />}
        <LinearGradient
          colors={["rgba(0,0,0,0.01)", "rgba(0,0,0,0.8)"]}
          style={{ padding: 10 }}
        >
          <View className="text-center ">
            <Text className="text-2xl font-bold text-white text-center">
              {user.name}, {user.age}
            </Text>
            <Text className="text-lg text-gray-300 text-center">
              Distance: {user.distance} Miles
            </Text>
          </View>
        </LinearGradient>
        <TouchableOpacity onPress={onSwipeRight}>
          <Image
            source={require("../../assets/images/like.png")}
            className="w-10 h-10 absolute bottom-5 right-3"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onSwipeLeft}>
          <Image
            source={require("../../assets/images/dislike.png")}
            className="w-10 h-10 absolute bottom-5 left-3"
          />
        </TouchableOpacity>
      </ImageBackground>
      <RatingButtons rate={rate} onRateChange={onRateChange} />
    </Animated.View>
  );
};

export default SwipeableCard;
