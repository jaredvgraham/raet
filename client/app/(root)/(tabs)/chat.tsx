import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useSession } from "@clerk/clerk-expo";
import { useAuthFetch } from "@/hooks/Privatefetch";

const Chat = () => {
  const authFetch = useAuthFetch();
  useEffect(() => {
    const fetchData = async () => {
      const response = await authFetch("/api/chat", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response?.json();

      console.log(data);
    };

    fetchData();
  }, []);

  return (
    <View>
      <Text>chat</Text>
    </View>
  );
};

export default Chat;
