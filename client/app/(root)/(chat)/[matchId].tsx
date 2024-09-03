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
import { Image } from "expo-image";
import Header from "@/components/header";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import UserDetailScreen from "@/components/feed/CloserLook";

const ChatScreen = () => {
  const { matchId } = useLocalSearchParams(); // Assume matchId and userId are passed as route params
  const authFetch = useAuthFetch();
  const [match, setMatch] = useState<Profile>();
  const { userId } = useAuth();
  const [gotMessages, setGotMessages] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputHeight, setInputHeight] = useState(40);
  const [isSending, setIsSending] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const chatRef = ref(db, `chats/${matchId}`);

    onChildAdded(chatRef, async (snapshot) => {
      console.log("new message snapshot", snapshot.val());

      const newMessage = snapshot.val();
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setGotMessages(true);
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
        console.log("data match", data.matchProfile);

        setMatch(data.matchProfile);
        // @ts-ignore
        setMatch((prevMatch) => {
          return {
            ...prevMatch,
            distance: data.distance,
            age: data.age,
          };
        });
      } catch (error) {
        console.error("Error fetching match:", error);
      }
    };
    fetchMatch();
  }, [matchId]);

  useEffect(() => {
    const readMsg = async () => {
      try {
        if (messages.length === 0 || !gotMessages) {
          return;
        }
        const newMessage = messages[messages.length - 1];

        console.log("newMessage", newMessage);

        if (
          newMessage.senderId === userId ||
          newMessage.receiverViewed === true
        )
          return;

        // Inform the backend that the message has been read
        const res = await authFetch(`/api/chat/message/read/${newMessage.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ matchId }),
        });
        console.log("res from read", res);
      } catch (error) {
        console.error("Failed to mark message as read:", error);
      }
    };
    readMsg();
  }, [gotMessages]);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    console.log("sending message", message, "to", matchId);
    setIsSending(true);

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
      }, 250); // small delay to ensure that FlatList has rendered
    }
  }, [messages]);

  const icon = require("@/assets/images/icon.jpeg");

  if (!match) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-lg text-gray-500">Loading Chat...</Text>
      </SafeAreaView>
    );
  }

  if (showProfile) {
    return (
      <UserDetailScreen
        profile={match}
        onClose={() => setShowProfile(false)}
        onSwipeLeft={() => {}}
        onSwipeRight={() => {}}
        showButtons={false}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0} // Adjust this value if needed
      >
        <Header
          backArrow={true}
          image={match?.images[0]}
          userName={match?.name}
          imageOnpress={() => setShowProfile(true)}
        />
        <View className="flex-1 justify-center p-4 bg-gray-100">
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View
                className={`flex-row items-end ${
                  item.senderId === userId ? "justify-end" : ""
                }`}
              >
                {item.senderId !== userId && (
                  <Image
                    source={match?.images[0]}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      marginRight: 8,
                      marginBottom: 8,
                    }}
                    contentFit="cover"
                    transition={1000}
                  />
                )}
                <View className="max-w-[80%]">
                  <View
                    className={` p-3 my-2 rounded-xl ${
                      item.senderId === userId ? "bg-blue-100" : "bg-gray-200"
                    }`}
                  >
                    <Text className="text-lg flex-wrap">{item.message}</Text>
                  </View>
                  {item.senderId === userId && (
                    <View className="flex flex-row items-center self-end mr-2">
                      <Text className="text-xs mr-2 text-gray-500">Sent</Text>

                      <Icon name="check-circle" size={20} color="#8fb3a1" />
                    </View>
                  )}
                </View>
              </View>
            )}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            onLayout={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
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
              placeholderTextColor="#6B7280"
              onContentSizeChange={(event) =>
                setInputHeight(event.nativeEvent.contentSize.height)
              }
              style={{ height: Math.max(40, inputHeight) }} // Ensure min height is 40
            />
            <Button title="Send" onPress={sendMessage} disabled={isSending} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
