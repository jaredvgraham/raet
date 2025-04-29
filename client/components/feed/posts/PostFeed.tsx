import React, { useRef, useEffect, useState, useMemo } from "react";
import { View, PanResponder } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePosts } from "@/hooks/usePosts";
import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import { PostList } from "@/components/feed/posts/postList";
import CreatePostScreen from "./CreatePost";
import Links from "../Links";
import { CommentSection } from "./CommentSection";
import { FloatingCreateButton } from "./FloatingCreateButton";

const PostFeedScreen = () => {
  const insets = useSafeAreaInsets();
  const keyboardVisible = useKeyboardVisible();
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy > 100) {
            setSelectedPostId(null);
          }
        },
      }),
    []
  );

  const [creatingPost, setCreatingPost] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const {
    posts,
    loading,
    refreshing,
    fetchPosts,
    refreshPosts,
    loadMorePosts,
    comments,
    commentText,
    setCommentText,
    fetchComments,
    submitComment,
  } = usePosts();

  const openComments = (postId: string) => {
    setSelectedPostId(postId);
    fetchComments(postId);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (creatingPost)
    return <CreatePostScreen setCreatingPost={setCreatingPost} />;

  return (
    <View
      className="flex-1 bg-gray-200 z-30 p-2"
      style={{ paddingTop: insets.top }}
    >
      <Links />
      <PostList
        posts={posts}
        loading={loading}
        refreshing={refreshing}
        onRefresh={refreshPosts}
        onLoadMore={loadMorePosts}
        onPostSelect={openComments}
      />
      {selectedPostId && (
        <CommentSection
          comments={comments}
          commentText={commentText}
          setCommentText={setCommentText}
          submitComment={() => submitComment(selectedPostId)}
          keyboardVisible={keyboardVisible}
          insets={insets}
          panHandlers={panResponder.panHandlers}
        />
      )}
      {!selectedPostId && (
        <FloatingCreateButton onPress={() => setCreatingPost(true)} />
      )}
    </View>
  );
};

export default PostFeedScreen;
