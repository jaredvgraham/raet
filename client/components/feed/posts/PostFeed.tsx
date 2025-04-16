import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthFetch } from "@/hooks/Privatefetch";
import PostCard from "./PostCard";
import Links from "../Links";
import CreatePostScreen from "./CreatePost";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import { Post } from "@/types";

const PostFeedScreen = () => {
  const insets = useSafeAreaInsets();
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
          ? `/api/post/feed?before=${encodeURIComponent(beforeDate)}`
          : `/api/post/feed`;

        const response = await authFetch(endpoint);
        const data = await response.json();

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
    <View
      className="flex-1 bg-white relative"
      style={{ paddingTop: insets.top }}
    >
      <Links />

      <View className="flex-1 ">
        <FlatList
          className=""
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <PostCard post={item} key={item._id} />}
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
        {/* Floating Create Button */}
        <TouchableOpacity
          onPress={() => setCreatingPost(true)}
          className="absolute bottom-6 right-4 bg-black/60 p-4 rounded-full shadow-md active:scale-95 border border-white/10"
          style={{ elevation: 8 }}
        >
          <Icon name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostFeedScreen;
