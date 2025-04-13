import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, Text, View, TouchableOpacity } from "react-native";
import { useSwipeFeed } from "@/hooks/useSwipeFeed";
import { Profile } from "@/types";
import { Image } from "expo-image";
import RatingButtons from "./RateButtons";
import ModernCard, { ModernCardRef } from "./ScrollableCard";
import Icon from "react-native-vector-icons/FontAwesome";
import Links from "./Links";

export default function FuturisticDeck() {
  const { profiles, loading, noProfilesLeft, fetchProfiles, handleSwipe } =
    useSwipeFeed();

  const [rate, setRate] = useState<number | null>(null);
  const [current, setCurrent] = useState<Profile | null>(null);
  const [next, setNext] = useState<Profile | null>(null);
  const [cardKey, setCardKey] = useState(0);

  const cardRef = useRef<ModernCardRef>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (profiles.length > 0) {
      setCurrent(profiles[0]);
      setNext(profiles[1] || null);
      setCardKey((prev) => prev + 1);
    } else {
      setCurrent(null);
      setNext(null);
    }
  }, [profiles]);

  const triggerSwipe = (dir: "left" | "right") => {
    cardRef.current?.swipe(dir);
  };

  if (loading || !current) return null;

  const onSwipe = (dir: "left" | "right") => {
    handleSwipe(current, dir, rate ?? undefined);
    setRate(null);
  };

  return (
    <SafeAreaView className="flex-1 justify-center bg-white   ">
      <Links />
      <View className="flex-1 w-full items-center relative px-2 rounded-xl pb-1">
        {next && (
          <ModernCard
            key={`${next._id}-back`}
            user={next}
            onSwipe={() => {}}
            isBackCard
          />
        )}
        <ModernCard
          key={cardKey}
          ref={cardRef}
          user={current}
          onSwipe={onSwipe}
        />
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
    </SafeAreaView>
  );
}
