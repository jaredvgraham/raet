import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Text } from "react-native";
import socket from "../../services/socketService";

type ChatComponentProps = {
  senderId: string;
  receiverId: string;
};

const ChatComponent = ({ senderId, receiverId }: ChatComponentProps) => {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    // Debugging: log the message and IDs before sending
    console.log("Sending message:", message);
    console.log("From senderId:", senderId, "To receiverId:", receiverId);

    socket.emit("sendMessage", { senderId, receiverId, message });
    setMessage(""); // Clear the input after sending
  };

  // Add this to debug when the component mounts
  useEffect(() => {
    console.log("ChatComponent mounted. Socket is connecting...");

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected.");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <View>
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type your message..."
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

export default ChatComponent;
