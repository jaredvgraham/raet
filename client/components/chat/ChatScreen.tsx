// ChatScreen.tsx
import React from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import ChatComponent from "./ChatComponent";
import MessageListComponent from "./MessageListComponent";
import { useLocalSearchParams } from "expo-router";

const ChatScreen = () => {
  // Extract params using useLocalSearchParams
  const params = useLocalSearchParams();
  const senderId = Array.isArray(params.senderId)
    ? params.senderId[0]
    : params.senderId;
  const receiverId = Array.isArray(params.receiverId)
    ? params.receiverId[0]
    : params.receiverId;

  // Check if parameters are valid
  if (!senderId || !receiverId) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Missing sender or receiver information.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Chat</Text>
      </View>

      <View style={styles.messageList}>
        <MessageListComponent userId={senderId} />
      </View>

      <View style={styles.chatInput}>
        <ChatComponent senderId={senderId} receiverId={receiverId} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#f5f5f5",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  messageList: {
    flex: 1,
    padding: 8,
  },
  chatInput: {
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#f5f5f5",
  },
});

export default ChatScreen;
