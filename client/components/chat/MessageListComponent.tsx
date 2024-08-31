import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import socket from "@/services/socketService";
import { Message } from "@/types";

const MessageListComponent = ({ userId }: { userId: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Fetch initial messages from the server or your API here
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages?userId=${userId}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [userId]);

  useEffect(() => {
    socket.on("receiveMessage", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage"); // Clean up on unmount
    };
  }, []);

  return (
    <View>
      {messages.length === 0 ? (
        <Text>No messages yet</Text>
      ) : (
        messages.map((message) => (
          <Text key={message._id}>
            {message.senderId === userId ? "You: " : "Other: "}
            {message.message}
          </Text>
        ))
      )}
    </View>
  );
};

export default MessageListComponent;
