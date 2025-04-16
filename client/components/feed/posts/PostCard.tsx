import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { formatDistanceToNow } from "date-fns";
import { Comment, Post } from "@/types";
import { useAuthFetch } from "@/hooks/Privatefetch";

type PostProps = {
  post: Post;
  commentsDisabled?: boolean;
};

const PostCard = ({ post, commentsDisabled }: PostProps) => {
  const [comment, setComment] = React.useState("");
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [commentCount, setCommentCount] = React.useState(post.commentCount);
  const [openComments, setOpenComments] = React.useState(false);
  const [liked, setLiked] = React.useState(post.likedByCurrentUser);
  const [likeCount, setLikeCount] = React.useState(post.likeCount);
  const authFetch = useAuthFetch();

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

  const handleLike = async (postId: string) => {
    try {
      const method = liked ? "DELETE" : "POST";
      await authFetch(`/api/post/${postId}/like`, { method });
      setLiked(!liked);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  const handleToggleComments = async () => {
    if (!openComments) {
      await fetchComments(post._id);
    }
    setOpenComments(!openComments);
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
      setCommentCount((prev) => prev + 1);
      setComment("");
      setComments((prev: Comment[]) => [data.comment, ...prev]);
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <View className="bg-white rounded-xl mb-6 overflow-hidden ">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <Image
          source={{ uri: post.userAvatar }}
          className="w-10 h-10 rounded-full mr-3"
        />
        <View>
          <Text className="text-sm font-semibold text-gray-800">
            {post.userName}
          </Text>
          <Text className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: false,
            })}{" "}
            ago
          </Text>
        </View>
      </View>

      {/* Image */}
      <Image
        source={{ uri: post.imageUrl }}
        className="w-full h-96"
        resizeMode="cover"
      />

      {/* Actions */}
      <View className="px-4 py-3">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center space-x-4">
            <TouchableOpacity onPress={() => handleLike(post._id)}>
              <Icon
                name={liked ? "heart" : "heart-o"}
                size={22}
                color={liked ? "red" : "#4B5563"}
              />
            </TouchableOpacity>
            {!commentsDisabled && (
              <TouchableOpacity onPress={handleToggleComments} className="mb-1">
                <Icon name="comment-o" size={22} color="#4B5563" />
              </TouchableOpacity>
            )}
          </View>

          <Text className="text-sm text-gray-500">
            {likeCount} likes
            {!commentsDisabled && ` · ${commentCount} comments`}
          </Text>
        </View>

        {/* Caption */}
        <View className="flex-row items-center">
          <Text className="text-gray-500 text-sm font-bold mr-2">
            {post.userName}
          </Text>
          <Text className="text-gray-800 text-sm font-light">
            {post.caption}
          </Text>
        </View>

        {/* Comments Section */}
        {openComments && (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={80} // adjust depending on your layout
            className="max-h-64"
          >
            <FlatList
              data={comments}
              keyExtractor={(item: Comment) => item._id}
              className="mt-4"
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
                        {formatDistanceToNow(new Date(post.createdAt), {
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
            />

            <View className="flex-row items-center mt-4 border-t border-gray-200 pt-2">
              <TextInput
                value={comment}
                onChangeText={setComment}
                placeholder="Write a comment..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-full mr-2"
              />
              <TouchableOpacity
                onPress={() => handleSubmitComment(post._id, comment)}
              >
                <Icon name="send" size={18} color="#0f172a" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}
      </View>
    </View>
  );
};

export default PostCard;
