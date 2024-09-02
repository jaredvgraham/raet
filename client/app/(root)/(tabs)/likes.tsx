import { View, Text, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { Profile } from "@/types";
import { useAuthFetch } from "@/hooks/Privatefetch";
import { Image } from "expo-image";

const LikesPage = () => {
  const [likes, setLikes] = useState<Profile[]>([]);
  const authFetch = useAuthFetch();

  useEffect(() => {
    const fetchData = async () => {
      console.log("fetching likes");
      try {
        const response = await authFetch("/api/user/likes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response?.json();
        console.log("data", data);

        console.log("likes", data.likes);

        setLikes(data.likes);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Text className="text-lg text-center text-gray-500 mb-4">
        These Users like you
      </Text>
      <View className="flex-1 flex-wrap flex-row justify-between p-2">
        {likes.length > 0 ? (
          likes.map((like, index) => (
            <View
              key={like._id}
              className="w-[48%] mb-4"
              style={{
                // Adjust the width to ensure 2 items per row
                width: "48%",
              }}
            >
              <Image
                source={{ uri: like.images[0] }}
                style={{ width: "100%", height: 150 }}
                className="rounded-lg"
              />
              <Text className="absolute z-10 bottom-0 p-2 bg-black mt-2 text-white">
                {like.name.split(" ")[0]}
              </Text>
            </View>
          ))
        ) : (
          <Text>No likes yet</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default LikesPage;
