import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";

type Props = {
  onSend: (text: string) => void;
  isSending: boolean;
};

export default function ChatInput({ onSend, isSending }: Props) {
  const [message, setMessage] = useState("");
  const [height, setHeight] = useState(40);

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage("");
  };

  return (
    <View className="flex-row items-center p-3 border-t border-gray-300">
      <TextInput
        className={`flex-1 border border-gray-400 p-3 mr-2 ${
          height > 40 ? "rounded-3xl" : "rounded-full"
        }`}
        multiline
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message"
        placeholderTextColor="#6B7280"
        onContentSizeChange={(e) => setHeight(e.nativeEvent.contentSize.height)}
        style={{ height: Math.max(40, height) }}
      />
      <Button title="Send" onPress={handleSend} disabled={isSending} />
    </View>
  );
}
