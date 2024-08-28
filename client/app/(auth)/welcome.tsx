import { View, Text, TouchableOpacity } from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Swiper from "react-native-swiper";

const data = [
  {
    title: "Welcome to the app",
    description: "This is a description",
  },
  {
    title: "Welcome to the app",
    description: "This is a description",
  },
  {
    title: "Welcome to the app",
    description: "This is a description",
  },
];

const Welcome = () => {
  const swipwerRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <SafeAreaView className="flex h-full items-center  justify-between bg-white">
      <TouchableOpacity
        className="w-full justify-end items-end p-5 rounded-lg"
        onPress={() => router.push("/(auth)/sign-up")}
      >
        <Text className="text-blue-500 text-md font-bold">Skip</Text>
      </TouchableOpacity>
      <Swiper
        ref={swipwerRef}
        loop={false}
        dot={<View className="w-[32px] h-4 bg-gray-300 rounded-full mx-1" />}
        activeDot={<View className="w-[32px] h-4 bg-black rounded-full mx-1" />}
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {data.map((item, index) => (
          <View
            key={index}
            className="flex flex-col items-center justify-center"
          >
            <Text className="text-2xl font-bold">{item.title}</Text>
            <Text className="text-md text-gray-500">{item.description}</Text>
          </View>
        ))}
      </Swiper>
      <TouchableOpacity
        className="w-full justify-center items-center p-5 rounded-lg"
        onPress={() => {
          if (activeIndex === data.length - 1) {
            router.push("/(auth)/sign-up");
          } else {
            swipwerRef.current?.scrollBy(1);
          }
        }}
      >
        <Text className="text-blue-500 text-md font-bold">
          {activeIndex === data.length - 1 ? "Get Started" : "Next"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Welcome;
