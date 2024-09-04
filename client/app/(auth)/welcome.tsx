import { View, Text, TouchableOpacity } from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Swiper from "react-native-swiper";
import { Image } from "expo-image";
import { Dimensions } from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const data = [
  {
    title: "Welcome to Raet",
    description: "See only the best matches!",
    image: require("../../assets/images/feed.png"),
  },
  {
    title: "See Who Likes You",
    description: "Match instantly with others",
    image: require("../../assets/images/likes.png"),
  },
  {
    title: "Real-time Conversations",
    description: "Chat instantly with others",
    image: require("../../assets/images/chat.png"),
  },
];

const Welcome = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <SafeAreaView className="flex h-full items-center ">
      {/* Skip Button */}
      <TouchableOpacity
        className="self-end mr-4 mt-4"
        onPress={() => router.push("/(auth)/sign-up")}
      >
        <Text className="text-gray-600 text-sm font-semibold">Skip</Text>
      </TouchableOpacity>

      {/* Dots at the top */}
      <View className="flex-row items-center justify-center pt-4">
        {data.map((_, index) => (
          <View
            key={index}
            className={`w-[8px] h-[8px] mx-1 rounded-full ${
              activeIndex === index
                ? "bg-teal-300 w-[12px] h-[12px]"
                : "bg-gray-300"
            }`}
          />
        ))}
      </View>

      {/* Swiper for Welcome Screens */}
      <Swiper
        ref={swiperRef}
        loop={false}
        showsPagination={false} // Hide default dots as we're custom rendering them at the top
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {data.map((item, index) => (
          <View key={index} className="flex-1 items-center justify-center px-8">
            <Text className="text-3xl font-extrabold text-black mb-3 text-center">
              {item.title}
            </Text>
            <Text className="text-base text-gray-500 mb-6 text-center leading-relaxed">
              {item.description}
            </Text>
            <View className="w-full h-96    shadow-lg">
              <Image
                source={item.image}
                className="w-full h-full rounded-3xl"
                contentFit="contain"
                style={{
                  borderColor: "white",
                  borderBottomLeftRadius: 110,
                  borderBottomRightRadius: 110,
                }}
              />
            </View>
          </View>
        ))}
      </Swiper>

      {/* Next/Get Started Button */}
      <TouchableOpacity
        className="w-11/12 py-4 bg-teal-300 rounded-full justify-center items-center shadow-lg mb-3"
        onPress={() => {
          if (activeIndex === data.length - 1) {
            router.push("/(auth)/sign-up");
          } else {
            swiperRef.current?.scrollBy(1);
          }
        }}
      >
        <Text className="text-lg font-bold text-white">
          {activeIndex === data.length - 1 ? "Get Started" : "Next"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Welcome;
