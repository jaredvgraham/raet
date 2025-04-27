import React from "react";
import {
  View,
  Text,
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
import { useRouter } from "expo-router";
import { Image } from "expo-image";

type PostProps = {
  post: Post;
  commentCount?: number;
  commentsDisabled?: boolean;
  toggleComments?: () => void;
  closeComments?: () => void;
};

const PostCard = ({
  post,
  commentsDisabled,
  toggleComments,
  commentCount,
}: PostProps) => {
  const [liked, setLiked] = React.useState(post.likedByCurrentUser);
  const [likeCount, setLikeCount] = React.useState(post.likeCount);
  const authFetch = useAuthFetch();
  const Router = useRouter();

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

  return (
    <View className="flex-1 bg-white rounded-xl mb-6 overflow-hidden  ">
      {/* Header */}
      <TouchableOpacity
        className="flex-row items-center px-4 py-3"
        onPress={() => {
          Router.push(`/home/${post.userId}`);
        }}
      >
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
      </TouchableOpacity>

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
            {!commentsDisabled && toggleComments && (
              <TouchableOpacity onPress={toggleComments} className="mb-1">
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
      </View>
    </View>
  );
};

export default PostCard;
