import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ref, push, onChildAdded, set } from "firebase/database";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { db } from "@/services/firebaseConfig";
import { Message, Profile } from "@/types";
import { useAuthFetch } from "@/hooks/Privatefetch";

const ChatScreen = () => {
  const { matchId } = useLocalSearchParams(); // Assume matchId and userId are passed as route params
  const authFetch = useAuthFetch();
  const [mtach, setMatch] = useState<Profile>();
  const { userId } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputHeight, setInputHeight] = useState(40);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const chatRef = ref(db, `chats/${matchId}`);

    onChildAdded(chatRef, (snapshot) => {
      const newMessage = snapshot.val();
      const messageExists = messages.some(
        (message) => message.sentAt === newMessage.sentAt
      );
      setMessages((prevMessages) =>
        messageExists ? prevMessages : [...prevMessages, newMessage]
      );
    });
  }, [matchId]);

  useEffect(() => {
    const fetchMatch = async () => {
      console.log("fetching match", matchId);

      try {
        const response = await authFetch(`/api/match/${matchId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response?.json();
        console.log("data match", data);

        setMatch(data);
      } catch (error) {
        console.error("Error fetching match:", error);
      }
    };
    fetchMatch();
  }, [matchId]);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    console.log("sending message", message, "to", matchId);

    try {
      const response = await authFetch("/api/chat/send-message", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          matchId,
          messageText: message,
        }),
      });
      const data = await response?.json();
      console.log(data);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100); // small delay to ensure that FlatList has rendered
    }
  }, [messages]);
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0} // Adjust this value if needed
    >
      <View className="flex-1 justify-center p-4 bg-gray-100">
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              className={`p-3 my-2 rounded-lg ${
                item.senderId === userId
                  ? "bg-blue-100 self-end"
                  : "bg-gray-200"
              }`}
            >
              <Text className="font-bold">
                {item.senderId === userId ? "You" : "Them"}:
              </Text>
              <Text className="text-lg">{item.message}</Text>
            </View>
          )}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        <View className="flex-row items-center p-3 border-t border-gray-300">
          <TextInput
            className={`flex-1 border border-gray-400 p-3 mr-2 ${
              inputHeight > 40 ? "rounded-3xl" : "rounded-full"
            }`}
            value={message}
            onChangeText={setMessage}
            multiline={true}
            placeholder="Type a message"
            onContentSizeChange={(event) =>
              setInputHeight(event.nativeEvent.contentSize.height)
            }
            style={{ height: Math.max(40, inputHeight) }} // Ensure min height is 40
          />
          <Button title="Send" onPress={sendMessage} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
