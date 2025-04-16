import { View, Text } from "react-native";
import React, { useLayoutEffect } from "react";
import PostFeedScreen from "@/components/feed/posts/PostFeed";
import { useNavigation } from "expo-router";

const posts = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return <PostFeedScreen />;
};

export default posts;
