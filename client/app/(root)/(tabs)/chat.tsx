import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuthFetch } from "@/hooks/Privatefetch";
import { router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

const Chat = () => {
  const authFetch = useAuthFetch();
  const { userId } = useAuth();

  const [matches, setMatches] = useState<
    {
      matchId: string;
      profile: { clerkId: string; images: string[]; name: string };
    }[]
  >([]);
  const [noMatches, setNoMatches] = useState<boolean>(true);
  const [conversations, setConversations] = useState<any>([]);
  const [noConversations, setNoConversations] = useState<boolean>(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await authFetch("/api/chat/matches");
        const data = await response?.json();
        console.log("data", data.matches);
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
        console.log("conversations", data);

        setConversations(data);
        console.log(data.length);
        if (data === undefined || data.length === 0) {
          setNoConversations(true);
        }

        setNoConversations(data.length === 1);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setConversations([]);
        setNoConversations(true);
      }
    };

    // fetchConversations();
    fetchMatches();
  }, []);

  const handleConvoClick = (matchId: string) => {
    console.log("matchId", matchId);
    router.push(`/(root)/(chat)/${matchId}`);
  };

  return (
    <SafeAreaView className=" flex bg-white">
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
                    <Text className="text-center">{match.profile.name}</Text>
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
          <View className="flex-1">
            {conversations?.map((conversation: any) => (
              <View
                key={conversation._id}
                className="p-4 border-b border-gray-300 flex items-center"
              >
                <TouchableOpacity
                  onPress={() => handleConvoClick(conversation.matchId)}
                >
                  <Text className="font-bold">{conversation.name}</Text>
                  <Text>{conversation.lastMessage}</Text>
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
