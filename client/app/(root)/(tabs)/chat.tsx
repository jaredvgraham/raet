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
import Icon from "react-native-vector-icons/FontAwesome";
import Loading from "@/components/Loading";

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
  const [noMatches, setNoMatches] = useState<boolean>(false);
  const [noConversations, setNoConversations] = useState<boolean>(false);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingConversations, setLoadingConversations] = useState(true);

  const fetchMatches = async () => {
    setLoadingMatches(true);
    try {
      const response = await authFetch("/api/chat/matches", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response?.json();
      const matches = data.matches;
      console.log("matches length is", matches.length);
      console.log("matches length is", matches.length);
      console.log("matches length is", matches.length);
      console.log("matches length is", matches.length);

      setMatches(matches);
      setNoMatches(matches.length === 0);
    } catch (error) {
      console.error("Error fetching matches:", error);
      setNoMatches(true);
    } finally {
      setLoadingMatches(false);
    }
  };

  const fetchConversations = async () => {
    setLoadingConversations(true);
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
          console.log(conversation.receiverViewed);
          console.log(conversation.receiverViewed);
          console.log(conversation.receiverViewed);
          console.log(conversation.receiverViewed);

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
    } finally {
      setLoadingConversations(false);
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
    <SafeAreaView className="flex-1 ">
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
              <View className=" w-28 h-32 bg-black border border-gray-300 mb-6 rounded-2xl text-white flex items-center justify-center">
                <Text className="text-center text-3xl text-teal-300">
                  {matches.length}
                </Text>
                <Text className="text-center text-gray-300">Matches</Text>
              </View>
              {loadingMatches ? (
                <Loading />
              ) : (
                noMatches && (
                  <Text className="text-center text-gray-500">
                    No matches found. Please try again later.
                  </Text>
                )
              )}
              {matches.map((match) => (
                <View key={match.matchId}>
                  <TouchableOpacity
                    onPress={() => handleConvoClick(match.matchId)}
                  >
                    <Image
                      source={{ uri: match.profile.images[0] }}
                      className="w-28 h-32 rounded-2xl shadow-2xl"
                    />
                    <Text className="text-center font-semibold mt-2">
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
          {loadingConversations && (
            <View className="flex-1 items-center justify-center">
              <Loading />
            </View>
          )}
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

                const sentByMe = conversation.lastMessage.senderId === userId;

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
                        className="w-16 h-16 rounded-full mr-4"
                      />
                      <View>
                        <Text
                          className={`font-bold ${
                            notRead ? "text-gray-300" : "text-black"
                          } `}
                        >
                          {conversation?.matchedUser?.name}
                        </Text>
                        <View className="flex-row items-center">
                          {sentByMe && (
                            <Icon
                              name="check"
                              size={15}
                              color={"lightgray"}
                              style={{ marginRight: 4 }}
                            />
                          )}
                          {!sentByMe && (
                            <Icon
                              name="bell"
                              size={15}
                              color={`${notRead ? "lightgreen" : "gray"}`}
                              style={{ marginRight: 4 }}
                            />
                          )}
                          <Text numberOfLines={1} className="text-gray-400">
                            {conversation?.lastMessage.message}
                          </Text>
                        </View>
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
