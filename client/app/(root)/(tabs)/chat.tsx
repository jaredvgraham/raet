import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useAuthFetch } from "@/hooks/Privatefetch";
import { router, useFocusEffect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { ref, query, limitToLast, onChildAdded } from "firebase/database";
import { db } from "@/services/firebaseConfig";
import { Image } from "expo-image";

const Chat = () => {
  const authFetch = useAuthFetch();
  const { userId } = useAuth();

  const [matches, setMatches] = useState<
    {
      matchId: string;
      profile: { clerkId: string; images: string[]; name: string };
    }[]
  >([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [noMatches, setNoMatches] = useState<boolean>(true);
  const [noConversations, setNoConversations] = useState<boolean>(true);

  const fetchMatches = async () => {
    try {
      const response = await authFetch("/api/chat/matches", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response?.json();
      const matches = data.matches;

      setMatches(matches);
      setNoMatches(matches.length === 0);
    } catch (error) {
      console.error("Error fetching matches:", error);
      setNoMatches(true);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await authFetch("/api/chat/conversations");
      const data = await response?.json();
      const initialConversations = data.conversations;

      console.log("initialConversations last message", initialConversations);

      if (!initialConversations || initialConversations.length === 0) {
        setNoConversations(true);
      } else {
        setConversations(initialConversations);
        setNoConversations(false);

        // Listen for the latest message in each conversation
        initialConversations.forEach((conversation: any) => {
          const chatRef = query(
            ref(db, `chats/${conversation.matchId}`),
            limitToLast(1)
          );

          // Listen for new messages
          onChildAdded(chatRef, (snapshot) => {
            const newMessage = snapshot.val();
            setConversations((prevConversations) => {
              const updatedConversations = prevConversations.map((convo) => {
                if (convo.matchId === conversation.matchId) {
                  // Merge the new message with the existing lastMessage object
                  return {
                    ...convo,
                    lastMessage: {
                      ...convo.lastMessage, // Retain the previous properties
                      ...newMessage, // Merge in new properties from newMessage
                    },
                  };
                }
                return convo;
              });
              console.log("updatedConversations", updatedConversations);
              return updatedConversations;
            });
          });
        });
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setConversations([]);
      setNoConversations(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log("Hello, I am focused!");
      fetchMatches();
      fetchConversations();

      return () => {
        console.log("This route is now unfocused.");
      };
    }, [])
  );

  const handleConvoClick = (matchId: string) => {
    router.push(`/(root)/(chat)/${matchId}`);
  };

  return (
    <SafeAreaView className="flex bg-white">
      <View className="p-4 border-b border-gray-300">
        <Text className="text-xl font-bold">Matches</Text>
      </View>
      <View className="flex">
        {noMatches ? (
          <Text className="text-center text-gray-500">
            No matches found. Please try again later.
          </Text>
        ) : (
          <View className="">
            <View className="p-4 border-b border-gray-300 flex flex-row items-center overflow-auto overflow-x-scroll">
              {matches.map((match) => (
                <View key={match.matchId}>
                  <TouchableOpacity
                    onPress={() => handleConvoClick(match.matchId)}
                  >
                    <Image
                      source={{ uri: match.profile.images[0] }}
                      className="w-12 h-12 rounded-full"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      <View className="p-4 border-t border-gray-300">
        <Text className="text-xl font-bold">Conversations</Text>
      </View>

      <View className="flex">
        {noConversations ? (
          <Text className="text-center text-gray-500">
            No conversations found. Please try again later.
          </Text>
        ) : (
          <View className="">
            {conversations.map((conversation) => (
              <View
                key={conversation.matchId}
                className={`p-4 border-b border-gray-300 flex-row items-center ${
                  conversation.lastMessage &&
                  conversation.lastMessage.senderId &&
                  conversation.lastMessage.senderId !== userId &&
                  !conversation.lastMessage.receiverViewed
                    ? "bg-black"
                    : ""
                }`}
              >
                <TouchableOpacity
                  onPress={() => handleConvoClick(conversation.matchId)}
                  className="flex-row items-center "
                >
                  <Image
                    source={{ uri: conversation?.matchedUser?.images[0] }}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <View>
                    <Text className="font-bold">
                      {conversation?.matchedUser?.name}
                    </Text>
                    <Text numberOfLines={1} className="text-gray-600">
                      {conversation?.lastMessage.message}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Chat;
