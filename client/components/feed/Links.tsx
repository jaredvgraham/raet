import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { useFeedPage } from "@/hooks/useFeedPage";

const Links = () => {
  const { currentPage, setCurrentPage } = useFeedPage();

  const pages = ["Rate", "Explore", "Posts"];

  return (
    <View className="p-2 px-4 flex-row items-center justify-between  ">
      {/* Logo */}
      <Image
        source={require("../../assets/r-logo.png")}
        style={{ width: 40, height: 40 }}
      />

      {/* Navigation Links */}
      <View className="flex-row items-center gap-6">
        {pages.map((page) => {
          const isActive = currentPage === page;
          return (
            <TouchableOpacity
              key={page}
              onPress={() => setCurrentPage(page)}
              className={`pb-1 ${
                isActive
                  ? "border-b-2 border-black"
                  : "border-b-2 border-transparent"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  isActive ? "text-black" : "text-gray-400"
                }`}
              >
                {page}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default Links;
