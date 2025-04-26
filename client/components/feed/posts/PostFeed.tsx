import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  PanResponder,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthFetch } from "@/hooks/Privatefetch";
import PostCard from "./PostCard";
import Links from "../Links";
import CreatePostScreen from "./CreatePost";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import { Comment, Post } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";

const PostFeedScreen = () => {
  const insets = useSafeAreaInsets();
  const authFetch = useAuthFetch();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [creatingPost, setCreatingPost] = useState(false);
  const [toggleComments, setToggleComments] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [atTop, setAtTop] = useState(true); // assume at top initially

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        // optional: you can add dragging down animation later
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          setSelectedPostId(null);
          setToggleComments(false);
        }
      },
    })
  ).current;

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

  const fetchComments = async (postId: string) => {
    try {
      const response = await authFetch(`/api/post/${postId}/comments`);
      const data = await response.json();
      console.log("Fetched comments:", data.comments);

      setComments(data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleSubmitComment = async (postId: string, commentText: string) => {
    try {
      if (!commentText.trim()) return;
      const response = await authFetch(`/api/post/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText }),
      });

      const data = await response.json();
      console.log("Comment posted:", data);

      // Refresh comments after posting
      setPosts((prev) =>
        prev.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              comments: post.commentCount + 1,
            };
          }
          return post;
        })
      );

      setComment("");
      setComments((prev: Comment[]) => [data.comment, ...prev]);
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showListener = Keyboard.addListener(showEvent, () =>
      setKeyboardVisible(true)
    );
    const hideListener = Keyboard.addListener(hideEvent, () =>
      setKeyboardVisible(false)
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return creatingPost ? (
    <CreatePostScreen setCreatingPost={setCreatingPost} />
  ) : (
    <View
      className="flex-1 bg-white relative"
      style={{ paddingTop: insets.top }}
    >
      <Links />

      <View className="flex-1 ">
        {toggleComments && selectedPostId && (
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss(); // dismiss keyboard if open
              setSelectedPostId(null); // close comments modal
              setToggleComments(false);
            }}
          >
            <View className="absolute top-0 left-0 right-0 bottom-0  z-10"></View>
          </TouchableWithoutFeedback>
        )}
        <FlatList
          className=""
          data={posts}
          scrollEventThrottle={16}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              key={item._id}
              toggleComments={() => {
                if (selectedPostId === item._id) {
                  setSelectedPostId(null);
                  setToggleComments(false);
                } else {
                  setSelectedPostId(item._id);
                  fetchComments(item._id);
                }
                setToggleComments(!toggleComments);
              }}
              commentCount={item.commentCount}
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
        {toggleComments && selectedPostId && (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={80}
            style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
            className="absolute bottom-0 left-0 right-0 top-40 bg-white z-50"
          >
            <View
              {...panResponder.panHandlers}
              style={{
                height: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: "#ccc",
                }}
              />
            </View>
            <View
              className="flex-1 pt-4 px-1"
              style={[keyboardVisible && { paddingBottom: insets.bottom }]}
            >
              <FlatList
                data={comments}
                keyExtractor={(item) => item._id}
                onScroll={(event) => {
                  const offsetY = event.nativeEvent.contentOffset.y;
                  setAtTop(offsetY <= 0); // at top if scroll Y <= 0
                }}
                renderItem={({ item }) => (
                  <View className="flex-row items-start gap-3 mb-4 px-1">
                    {/* Profile Image */}
                    <Image
                      source={{ uri: item.userAvatar }}
                      className="w-9 h-9 rounded-full"
                    />

                    {/* Comment Content */}
                    <View className="flex-1 border-b border-gray-200 pb-2">
                      {/* Name & Timestamp */}
                      <View className="flex-row items-center justify-between gap-2">
                        <Text className="text-sm font-semibold text-gray-500">
                          {item.userName}
                        </Text>
                        <Text className="text-xs text-gray-400 text-right">
                          {formatDistanceToNow(new Date(item.createdAt), {
                            addSuffix: false,
                          })}{" "}
                          ago
                        </Text>
                      </View>

                      {/* Comment Text */}
                      <Text className="text-sm text-gray-800 mt-0.5">
                        {item.text}
                      </Text>
                    </View>
                  </View>
                )}
                contentContainerStyle={{ paddingBottom: 80 }}
              />

              <View className="flex-row items-center p-4 border-t border-gray-200 bg-white">
                <TextInput
                  value={comment}
                  onChangeText={setComment}
                  placeholder="Add a comment..."
                  className="flex-1 border border-gray-300 rounded-full px-3 py-2"
                />
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    handleSubmitComment(selectedPostId, comment);
                  }}
                  className="ml-2 bg-blue-500 px-4 py-2 rounded-full"
                >
                  <Text className="text-white">Post</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        )}

        {/* Floating Create Button */}
        {!toggleComments && (
          <TouchableOpacity
            onPress={() => setCreatingPost(true)}
            className="absolute bottom-6 right-4 bg-black/60 p-4 rounded-full shadow-md active:scale-95 border border-white/10"
            style={{ elevation: 8 }}
          >
            <Icon name="plus" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default PostFeedScreen;
