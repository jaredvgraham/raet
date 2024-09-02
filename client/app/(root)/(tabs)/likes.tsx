import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Profile } from "@/types";
import { useAuthFetch } from "@/hooks/Privatefetch";

const LikesPage = () => {
  const [likes, setLikes] = useState<Profile>();
  const authFetch = useAuthFetch();

  useEffect(() => {
    const fetchData = async () => {
      console.log("fetching likes");

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
    };

    fetchData();
  }, []);

  return (
    <View>
      <Text>likes</Text>
    </View>
  );
};

export default LikesPage;
