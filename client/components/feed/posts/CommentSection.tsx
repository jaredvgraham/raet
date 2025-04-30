import React, { useEffect } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { Comment } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";
import { Icon } from "react-native-vector-icons/Icon";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import Loading from "@/components/Loading";

interface CommentSectionProps {
  comments: Comment[];
  commentText: string;
  setCommentText: (text: string) => void;
  submitComment: () => void;
  keyboardVisible: boolean;
  insets: any;
  panHandlers: any;
  isParentPosts?: boolean;
  loadingComments?: boolean;
}

export const CommentSection = ({
  comments,
  commentText,
  setCommentText,
  submitComment,
  keyboardVisible,
  insets,
  panHandlers,
  isParentPosts = false,
  loadingComments,
}: CommentSectionProps) => {
  const { userId } = useAuth();
  const [isUser, setIsUser] = React.useState(false);

  const router = useRouter();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={isParentPosts ? 140 : 0} // increase this from 100 → 140
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        top: isParentPosts ? 60 : 208, // decrease from 80 → 60
        backgroundColor: "#f3f4f6",
        zIndex: 50,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: keyboardVisible ? insets.bottom + 80 : 60, // bump to +80
      }}
    >
      <View {...panHandlers} className="h-8 justify-center items-center ">
        <View className="w-10 h-1 rounded bg-gray-400" />
      </View>

      {loadingComments && <Loading />}
      <FlatList
        data={comments}
        className="bg-gray-100"
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="flex-row items-start gap-3 mb-4 px-2 ">
            <TouchableOpacity
              onPress={() => {
                if (userId === item.userId) return;
                router.push(`/home/${item.userId}`);
              }}
            >
              <Image
                source={{ uri: item.userAvatar }}
                className="w-9 h-9 rounded-full"
              />
            </TouchableOpacity>
            <View className="flex-1 border-b border-black/20 pb-2">
              <View className="flex-row justify-between">
                <TouchableOpacity
                  onPress={() => {
                    router.push(`/home/${item.userId}`);
                  }}
                >
                  <Text className="font-semibold text-sm">{item.userName}</Text>
                </TouchableOpacity>
                <Text className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(item.createdAt))} ago
                </Text>
              </View>
              <Text className="text-gray-800">{item.text}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <View className="flex-row items-center p-4 border-t border-gray-300 bg-gray-100">
        <View className="flex-1 relative">
          <TextInput
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Add a comment..."
            className="border border-gray-400 rounded-full px-4 py-2 pr-16" // NOTE: add 'pr-16' paddingRight
          />
          <TouchableOpacity
            onPress={() => {
              submitComment();
              Keyboard.dismiss();
            }}
            className="absolute right-1 top-1 bg-black/80  px-3 py-1 rounded-full"
          >
            <MaterialIcons
              name="send"
              size={18}
              color={`${commentText ? "#10b5b1" : "white"}`}
              // Rotate the icon
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
