import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { formatDistanceToNow } from "date-fns";
import { Post } from "@/types";
import { useAuthFetch } from "@/hooks/Privatefetch";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native";
import { MotiView, MotiImage } from "moti";

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
  console.log("display post", post);

  const [liked, setLiked] = React.useState(post.likedByCurrentUser);
  const [likeCount, setLikeCount] = React.useState(post.likeCount);
  const [showHeart, setShowHeart] = React.useState(false);

  const [localToggleComments, setLocalToggleComments] = React.useState(false);
  const [localCommentCount, setLocalCommentCount] = React.useState(
    commentCount || 0
  );

  const authFetch = useAuthFetch();
  const Router = useRouter();
  const lastTap = React.useRef<number | null>(null);

  const handleLike = async (postId: string) => {
    try {
      const method = liked ? "DELETE" : "POST";
      if (!liked) {
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 800);
      }
      await authFetch(`/api/post/${postId}/like`, { method });
      setLiked(!liked);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  return (
    <View className=" bg-white rounded-xl mb-6 overflow-hidden p-2   ">
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
      <TouchableWithoutFeedback
        onPress={() => {
          const now = Date.now();
          if (lastTap.current && now - lastTap.current < 300) {
            // 300ms for double tap
            handleLike(post._id);
          }
          lastTap.current = now;
        }}
      >
        <View className="w-full h-96 rounded-xl overflow-hidden justify-center items-center">
          <Image
            source={{ uri: post.imageUrl }}
            className="w-full h-full absolute"
            resizeMode="cover"
          />

          {/* Animated heart */}
          {showHeart && (
            <MotiView
              from={{
                scale: 0.5,
                opacity: 0.8,
              }}
              animate={{
                scale: 1.5,
                opacity: 0,
              }}
              transition={{
                type: "timing",
                duration: 700,
              }}
              style={{
                position: "absolute",
              }}
            >
              <Icon name="heart" size={120} color="red" />
            </MotiView>
          )}
        </View>
      </TouchableWithoutFeedback>
      {/* Actions */}
      <View className="px-4 py-3">
        <View className="flex-row items-center justify-between mb-2">
          <View className="absolute bottom-8 right-3 p-2 rounded-full flex-row space-x-3">
            <TouchableOpacity
              onPress={() => handleLike(post._id)}
              className={`${
                liked ? "bg-gray-200" : "bg-black/50  "
              } rounded-full p-2 `}
            >
              <Feather
                name={"heart"}
                size={24}
                color={liked ? "red" : "white"}
              />
            </TouchableOpacity>
            {!commentsDisabled && toggleComments && (
              <TouchableOpacity
                onPress={toggleComments}
                className="bg-black/50 rounded-full p-2"
              >
                <Feather name="message-square" size={24} color="white" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={toggleComments}>
            <Text className="text-sm text-gray-500">
              {likeCount} likes
              {!commentsDisabled && ` · ${commentCount} comments`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Caption */}
        <View className="flex-row items-center">
          <Text className="text-gray-500 text-sm font-bold mr-2">
            {post.userName}
          </Text>
          <Text className="text-gray-600 text-sm font-light">
            {post.caption}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PostCard;
