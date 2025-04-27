import { useState, useCallback } from "react";
import { Post } from "@/types";
import { useAuthFetch } from "@/hooks/Privatefetch";

export function usePosts() {
  const authFetch = useAuthFetch();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (beforeDate?: string) => {
    console.log("Fetching posts beforeDate:", beforeDate);

    try {
      setLoading(true);
      const endpoint = beforeDate
        ? `/api/post/feed?before=${encodeURIComponent(beforeDate)}`
        : `/api/post/feed`;

      const res = await authFetch(endpoint);
      const data = await res.json();
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

      console.log("Fetched posts", data.posts.length);

      // Update hasMore based on how many posts you got
      setHasMore(data.posts.length > 1);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
    // <--- ONLY authFetch here, NOT hasMore
  };

  const refreshPosts = () => {
    console.log("Refreshing posts");

    setRefreshing(true);
    setHasMore(true);
    fetchPosts(undefined);
  };

  const loadMorePosts = () => {
    console.log("Loading more posts");
    console.log("loading", loading);
    console.log("hasMore", hasMore);
    console.log("posts.length", posts.length);

    if (loading || !hasMore || posts.length === 0) return;
    const lastPostDate = posts[posts.length - 1].createdAt;
    fetchPosts(lastPostDate);
  };

  return {
    posts,
    loading,
    refreshing,
    fetchPosts,
    refreshPosts,
    loadMorePosts,
  };
}
