import { View, Text } from "react-native";
import React from "react";
import FuturisticDeck from "@/components/feed/ScrollableDeck";
import { useFeedPage } from "@/hooks/useFeedPage";
import CreatePostScreen from "@/components/feed/posts/CreatePost";
import PostFeed from "@/components/feed/posts/PostFeed";

const Home = () => {
  const { currentPage } = useFeedPage();
  return (
    <>
      <FuturisticDeck />
    </>
  );
};

export default Home;
