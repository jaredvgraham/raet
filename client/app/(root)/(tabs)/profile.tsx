import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useAuthFetch } from "@/hooks/Privatefetch";

const profile = () => {
  const authFetch = useAuthFetch();

  useEffect(() => {
    const fetchData = async () => {
      console.log("fetching data");

      const response = await authFetch("/api/user/profile", {
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
      <Text>profile</Text>
    </View>
  );
};

export default profile;
