import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useAuthFetch } from "@/hooks/Privatefetch";
import { router, useFocusEffect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { ref, query, limitToLast, onChildAdded } from "firebase/database";
import { db } from "@/services/firebaseConfig";
import { Image } from "expo-image";
import Header from "@/components/header";

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

      console.log(
        "initialConversations length is",
        initialConversations.length
      );

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
              console.log(
                "updatedConversations length is ",
                updatedConversations.length
              );
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
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Header style="w-full flex items-center justify-center" />
        <View className="p-4 border-b border-gray-300">
          <Text className="text-xl font-bold">Matches</Text>
        </View>
        <View className="flex pt-4 pb-4 pl-1 ">
          {noMatches ? (
            <Text className="text-center text-gray-500">
              No matches found. Please try again later.
            </Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
              }}
            >
              {matches.map((match) => (
                <View key={match.matchId}>
                  <TouchableOpacity
                    onPress={() => handleConvoClick(match.matchId)}
                  >
                    <Image
                      source={{ uri: match.profile.images[0] }}
                      className="w-24 h-28 rounded-2xl"
                    />
                    <Text className="text-center font-semibold">
                      {match.profile.name.split(" ")[0]}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <View className="p-4 border-t border-gray-300">
          <Text className="text-xl font-bold">Conversations</Text>
        </View>

        <View className="flex-1">
          {noConversations ? (
            <Text className="text-center text-gray-500">
              No conversations found. Please try again later.
            </Text>
          ) : (
            <View>
              {conversations.map((conversation) => {
                const notRead =
                  conversation.lastMessage &&
                  conversation.lastMessage.senderId &&
                  conversation.lastMessage.senderId !== userId &&
                  !conversation.lastMessage.receiverViewed;

                return (
                  <TouchableOpacity
                    onPress={() => handleConvoClick(conversation.matchId)}
                    className={`flex-row items-center border-b border-gray-300 ${
                      notRead ? "bg-black text-gray-300" : ""
                    }`}
                    key={conversation.matchId}
                  >
                    <View
                      className={`p-4 flex-row items-center ${
                        notRead ? "bg-black text-gray-300" : ""
                      }`}
                    >
                      <Image
                        source={{ uri: conversation?.matchedUser?.images[0] }}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <View>
                        <Text
                          className={`font-bold ${
                            notRead ? "text-gray-300" : "text-black"
                          } `}
                        >
                          {conversation?.matchedUser?.name}
                        </Text>
                        <Text
                          numberOfLines={1}
                          className={`${
                            notRead ? "text-gray-300" : "text-black"
                          } `}
                        >
                          {conversation?.lastMessage.message}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Chat;
