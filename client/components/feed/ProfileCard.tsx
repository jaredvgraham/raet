import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated from "react-native-reanimated";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "@/utils/contants";
import RenderImageIndicators from "./RenderImageIndicators";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";

type ProfileCardProps = {
  user: any;
  currentImageIndex: number;
  triggerSwipe: (direction: string) => void;
  handleRateChange: (rate: number) => void;
};

const ProfileCard = ({
  user,
  currentImageIndex,
  triggerSwipe,
  handleRateChange,
}: ProfileCardProps) => {
  const position = useSwipeGesture(triggerSwipe);

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: -user.id,
        },
        position.getLayout(),
      ]}
      className="rounded-2xl shadow-lg"
    >
      <ImageBackground
        source={user.images[currentImageIndex].imgUrl}
        className="w-full h-full overflow-hidden rounded-t-2xl bg-black"
        style={{
          justifyContent: "flex-end",
        }}
      >
        <RenderImageIndicators
          images={user.images}
          currentImageIndex={currentImageIndex}
        />
        <LinearGradient
          colors={["rgba(0,0,0,0.01)", "rgba(0,0,0,0.8)"]}
          style={{
            padding: 10,
          }}
        >
          <View className="text-center">
            <Text className="text-2xl font-bold text-white text-center">
              {user.name}, {user.age}
            </Text>
            <Text className="text-lg text-gray-300 text-center">
              Distance: {user.location} Miles
            </Text>
          </View>
        </LinearGradient>
        <TouchableOpacity onPress={() => triggerSwipe("right")}>
          <Image
            source={require("../../assets/images/like.png")}
            className="w-10 h-10 absolute bottom-5 right-3"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => triggerSwipe("left")}>
          <Image
            source={require("../../assets/images/dislike.png")}
            className="w-10 h-10 absolute bottom-5 left-3"
          />
        </TouchableOpacity>
      </ImageBackground>

      <View
        className="flex-row justify-between bg-black p-3"
        style={{
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number, index) => (
          <TouchableOpacity
            className="bg-white p-2 min-w-[30px] rounded-lg"
            key={index}
            onPress={() => handleRateChange(number)}
          >
            <Text className="text-center text-gray-800">{number}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};

export default ProfileCard;
