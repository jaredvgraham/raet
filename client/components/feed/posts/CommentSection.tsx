import React from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Comment } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Image } from "expo-image";

interface CommentSectionProps {
  comments: Comment[];
  commentText: string;
  setCommentText: (text: string) => void;
  submitComment: () => void;
  keyboardVisible: boolean;
  insets: any;
  panHandlers: any;
}

export const CommentSection = ({
  comments,
  commentText,
  setCommentText,
  submitComment,
  keyboardVisible,
  insets,
  panHandlers,
}: CommentSectionProps) => (
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    className="absolute bottom-0 left-0 right-0 top-52 bg-gray-200 z-50"
    style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
  >
    <View {...panHandlers} className="h-8 justify-center items-center ">
      <View className="w-10 h-1 rounded bg-gray-400" />
    </View>

    <FlatList
      data={comments}
      className="bg-gray-200"
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View className="flex-row items-start gap-3 mb-4 px-2 ">
          <Image
            source={{ uri: item.userAvatar }}
            className="w-9 h-9 rounded-full"
          />
          <View className="flex-1 border-b border-black/20 pb-2">
            <View className="flex-row justify-between">
              <Text className="font-semibold text-sm">{item.userName}</Text>
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

    <View className="flex-row items-center p-4 border-t border-gray-300 bg-gray-200">
      <TextInput
        value={commentText}
        onChangeText={setCommentText}
        placeholder="Add a comment..."
        className="flex-1 border border-gray-400 rounded-full px-3 py-2"
      />
      <TouchableOpacity
        onPress={submitComment}
        className="ml-2 bg-blue-500 px-4 py-2 rounded-full"
      >
        <Text className="text-white">Post</Text>
      </TouchableOpacity>
    </View>
  </KeyboardAvoidingView>
);
