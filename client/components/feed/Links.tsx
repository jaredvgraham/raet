import { View, Text } from "react-native";
import React from "react";
import { useFeedPage } from "@/hooks/useFeedPage";

const Links = () => {
  const { currentPage, setCurrentPage } = useFeedPage();
  return (
    <View className="flex flex-row gap-2 mb-2">
      {["Feed", "Fyp"].map((page) => (
        <View className={` p-1 rounded-full`} key={page}>
          <Text
            key={page}
            onPress={() => setCurrentPage(page)}
            className={`${
              currentPage === page ? "text-red-400  underline" : "text-black"
            }`}
          >
            {page}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default Links;
