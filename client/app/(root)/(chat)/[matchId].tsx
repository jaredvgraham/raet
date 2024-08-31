import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import ChatComponent from "@/components/chat/ChatComponent";
import MessageListComponent from "@/components/chat/MessageListComponent";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

const ChatScreen = () => {
  // Extract params using useLocalSearchParams
  const { matchId } = useLocalSearchParams();
  const { userId } = useAuth();

  console.log("matchId from pa", matchId);

  const receiverId = Array.isArray(matchId) ? matchId[0] : matchId;
  const senderId = Array.isArray(userId) ? userId[0] : userId;

  // Check if parameters are valid
  if (!senderId || !matchId) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Text>Missing sender or receiver information.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4 border-b border-gray-300 bg-gray-200">
        <Text className="text-xl font-bold">Chat</Text>
      </View>

      <View className="flex-1 p-2">
        <MessageListComponent userId={senderId} />
      </View>

      <View className="p-2 border-t border-gray-300 bg-gray-200">
        <ChatComponent senderId={senderId} receiverId={receiverId} />
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
