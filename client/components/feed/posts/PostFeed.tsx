import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthFetch } from "@/hooks/Privatefetch";
import PostCard from "./PostCard";
import Links from "../Links";
import CreatePostScreen from "./CreatePost";

type Post = {
  _id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  caption: string;
  imageUrl: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  likedByCurrentUser: boolean;
};

const PostFeedScreen = () => {
  const authFetch = useAuthFetch();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [creatingPost, setCreatingPost] = useState(false);

  const fetchPosts = useCallback(
    async (beforeDate?: string, isRefreshing = false) => {
      if (!isRefreshing && !hasMore) return;
      try {
        setLoading(true);
        const endpoint = beforeDate
          ? `/api/post/feed/${beforeDate}`
          : `/api/post/feed`;

        const response = await authFetch(endpoint);
        const data = await response.json();
        console.log("Fetched posts:", data);

        if (!data.posts || !Array.isArray(data.posts)) return;

        setPosts((prev) => {
          const map = new Map(prev.map((p) => [p._id, p]));

          for (const post of data.posts) {
            if (!map.has(post._id)) {
              map.set(post._id, post);
            }
          }

          return Array.from(map.values());
        });

        setHasMore(data.posts.length === 10); // If backend returns less than 10, assume end
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
        if (isRefreshing) setRefreshing(false);
      }
    },
    [authFetch, hasMore]
  );

  useEffect(() => {
    fetchPosts();
  }, []); // Run only on mount

  const handleRefresh = () => {
    setRefreshing(true);
    setHasMore(true); // Reset hasMore on refresh
    fetchPosts(undefined, true);
  };

  const handleLoadMore = () => {
    if (loading || !hasMore || posts.length === 0) return;
    const lastPostDate = posts[posts.length - 1].createdAt;
    fetchPosts(lastPostDate);
  };

  return creatingPost ? (
    <CreatePostScreen setCreatingPost={setCreatingPost} />
  ) : (
    <SafeAreaView className="flex-1">
      <Links />

      <View className="px-4 py-2">
        <Text
          className="text-lg font-semibold text-blue-500 text-right"
          onPress={() => setCreatingPost(true)}
        >
          Create Post
        </Text>
      </View>
      <View className="flex-1 ">
        <FlatList
          className=""
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              onLike={() => {}}
              onComment={() => {}}
              key={item._id}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? (
              <View className="py-4">
                <ActivityIndicator size="large" color="#000" />
              </View>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default PostFeedScreen;
