import { View, Text } from "react-native";
import React, { useEffect } from "react";
import FuturisticDeck from "@/components/feed/ScrollableDeck";
import { useFeedPage } from "@/hooks/useFeedPage";
import CreatePostScreen from "@/components/feed/posts/CreatePost";
import PostFeed from "@/components/feed/posts/PostFeed";
import { registerForPushNotificationsAsync } from "@/utils/notifications";
import { useAuthFetch } from "@/hooks/Privatefetch";

const Home = () => {
  const { currentPage } = useFeedPage();
  const authFetch = useAuthFetch();
  useEffect(() => {
    const getPushToken = async () => {
      const token = await registerForPushNotificationsAsync();
      await authFetch("/api/user/push-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pushToken: token }),
      });
    };
    getPushToken();
  }, []);
  return (
    <>
      <FuturisticDeck />
    </>
  );
};

export default Home;
