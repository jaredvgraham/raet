import React from "react";
import {
  FlatList,
  RefreshControl,
  ActivityIndicator,
  View,
} from "react-native";

import { Post } from "@/types";
import PostCard from "./PostCard";

interface PostListProps {
  posts: Post[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onPostSelect: (postId: string) => void;
}
//
export const PostList = ({
  posts,
  loading,
  refreshing,
  onRefresh,
  onLoadMore,
  onPostSelect,
}: PostListProps) => (
  <FlatList
    data={posts}
    keyExtractor={(item) => item._id}
    extraData={posts.length}
    renderItem={({ item }) => (
      <View className="">
        <PostCard
          key={item._id}
          post={item}
          toggleComments={() => onPostSelect(item._id)}
          commentCount={item.commentCount}
        />
      </View>
    )}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
    onEndReached={onLoadMore}
    onEndReachedThreshold={0.5}
    ListFooterComponent={
      loading ? (
        <View className="py-4">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : null
    }
  />
);
