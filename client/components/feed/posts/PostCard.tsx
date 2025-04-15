import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { formatDistanceToNow } from "date-fns";

type PostProps = {
  post: {
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
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
};

const PostCard = ({ post, onLike, onComment }: PostProps) => {
  return (
    <View className="bg-white rounded-xl shadow-2xl mb-6 overflow-hidden">
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
            {formatDistanceToNow(new Date(post.createdAt))} ago
          </Text>
        </View>
      </View>

      {/* Image */}
      <Image
        source={{ uri: post.imageUrl }}
        className="w-full h-96"
        resizeMode="cover"
      />

      {/* Footer */}
      <View className="px-4 py-3">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center space-x-4">
            <TouchableOpacity onPress={() => onLike(post._id)}>
              <Icon
                name={post.likedByCurrentUser ? "heart" : "heart-o"}
                size={22}
                color={post.likedByCurrentUser ? "red" : "#4B5563"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onComment(post._id)}
              className="mb-1"
            >
              <Icon name="comment-o" size={22} color="#4B5563" />
            </TouchableOpacity>
          </View>

          <Text className="text-sm text-gray-500">
            {post.likeCount} likes · {post.commentCount} comments
          </Text>
        </View>

        {/* Caption */}
        <View className="flex-row items-center">
          <Text className="text-gray-500 text-sm  font-bold mr-2">
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
