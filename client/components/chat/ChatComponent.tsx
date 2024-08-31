// Example usage in a component
import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import socket from "../../services/socketService";

type ChatComponentProps = {
  senderId: string;
  receiverId: string;
};

const ChatComponent = ({ senderId, receiverId }: ChatComponentProps) => {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    socket.emit("sendMessage", { senderId, receiverId, message });
    setMessage(""); // Clear the input after sending
  };

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
