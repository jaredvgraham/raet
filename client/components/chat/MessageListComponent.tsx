// Example usage in a component
import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import socket from "@/services/socketService";
import { Message } from "@/types";

const MessageListComponent = ({ userId }: { userId: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Fetch initial messages
  }, []);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage"); // Clean up on unmount
    };
  }, []);

  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <Text>
          {item.senderId === userId ? "You: " : "Other: "}
          {item.message}
        </Text>
      )}
    />
  );
};

export default MessageListComponent;
