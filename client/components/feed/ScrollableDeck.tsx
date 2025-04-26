import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, Text, View, TouchableOpacity } from "react-native";
import { useSwipeFeed } from "@/hooks/useSwipeFeed";
import { Profile } from "@/types";
import { Image } from "expo-image";
import RatingButtons from "./RateButtons";
import ModernCard, { ModernCardRef } from "./ScrollableCard";
import Icon from "react-native-vector-icons/FontAwesome";
import Links from "./Links";
import Loading from "../Loading";

export default function FuturisticDeck() {
  const {
    profiles,
    loading,
    noProfilesLeft,
    fetchProfiles,
    handleSwipe,
    setNoProfilesLeft,
    noneLeft,
  } = useSwipeFeed();

  const [rate, setRate] = useState<number | null>(null);
  const [current, setCurrent] = useState<Profile | null>(null);
  const [next, setNext] = useState<Profile | null>(null);
  const [cardKey, setCardKey] = useState(0);

  const cardRef = useRef<ModernCardRef>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (loading) return;
    if (profiles.length > 0) {
      setCurrent(profiles[0]);
      setNext(profiles[1] || null);
      setCardKey((prev) => prev + 1);
    } else {
      setNoProfilesLeft(true);
      setCurrent(null);
      setNext(null);
    }
  }, [profiles, loading]);

  const triggerSwipe = (dir: "left" | "right") => {
    cardRef.current?.swipe(dir);
  };

  if (noProfilesLeft) {
    return (
      <SafeAreaView className="flex-1  bg-white">
        <Links />
        <View className="flex-1 justify-center items-center bg-white border-2 border-gray-700 rounded-xl">
          <Text className="text-xl text-gray-500">No more profiles</Text>
        </View>
      </SafeAreaView>
    );
  }

  const onSwipe = (dir: "left" | "right") => {
    handleSwipe(current as Profile, dir, rate ?? undefined);
    setRate(null);
  };

  return (
    <SafeAreaView className="flex-1 justify-center bg-white   ">
      <Links />

      {loading ? (
        <Loading />
      ) : (
        <>
          <View className="flex-1 w-full items-center relative  rounded-xl pb-1">
            {next && (
              <ModernCard
                key={`${next._id}-back`}
                user={next}
                onSwipe={() => {}}
                isBackCard
              />
            )}
            {current && (
              <ModernCard
                key={cardKey}
                ref={cardRef}
                user={current as Profile}
                onSwipe={onSwipe}
              />
            )}
          </View>

          {/* Like / Dislike Buttons */}
          <View className="absolute bottom-48 right-3 gap-3">
            <TouchableOpacity
              onPress={() => triggerSwipe("right")}
              style={{
                backgroundColor: "rgba(0, 0, 0, 1.5)",
                borderColor: "rgb(82, 204, 43)", // ✅ green border with opacity
                borderWidth: 2,
                borderRadius: 999,
                padding: 12,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="heart" size={40} color="rgb(82, 204, 43)" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => triggerSwipe("left")}
              style={{
                backgroundColor: "rgba(0, 0, 0, 1.5)",
                borderColor: "rgb(239, 68, 68)", // Tailwind red-500
                borderWidth: 2,
                borderRadius: 999,
                padding: 12,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="times" size={40} color="rgb(239, 68, 68)" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
