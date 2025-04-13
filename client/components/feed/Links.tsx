import { View, Text, Touchable, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Image } from "expo-image";
import { useFeedPage } from "@/hooks/useFeedPage";
import { useRouter } from "expo-router";

const Links = () => {
  const Router = useRouter();
  const [currentPage, setCurrentPage] = useState("");
  return (
    <View className="p-1 px-4 flex-row items-center justify-between">
      <Image
        source={require("../../assets/r-logo.png")} // Update this path to your logo
        style={{ width: 40, height: 40 }}
      />
      <View className="flex-row items-center gap-8">
        <TouchableOpacity onPress={() => setCurrentPage("home")}>
          <Text>Rate</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentPage("explore")}>
          <Text>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentPage("posts")}>
          <Text>Posts</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Links;
