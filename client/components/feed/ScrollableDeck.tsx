import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, View, TouchableOpacity } from "react-native";
import { useSwipeFeed } from "@/hooks/useSwipeFeed";
import { Profile } from "@/types";
import { Image } from "expo-image";
import RatingButtons from "./RateButtons";
import ModernCard from "./ScrollableCard";

export default function FuturisticDeck() {
  const { profiles, loading, noProfilesLeft, fetchProfiles, handleSwipe } =
    useSwipeFeed();

  const [rate, setRate] = useState<number | null>(null);
  const [current, setCurrent] = useState<Profile | null>(null);
  const [next, setNext] = useState<Profile | null>(null);
  const [cardKey, setCardKey] = useState(0);

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

  if (loading || !current) return null;

  const onSwipe = (dir: "left" | "right") => {
    handleSwipe(current, dir, rate ?? undefined);
    setRate(null);
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <View>
        <Text>Hey</Text>
      </View>
      <View className="flex-1 w-full items-center justify-center relative p-2">
        {next && (
          <ModernCard
            key={`${next._id}-back`}
            user={next}
            onSwipe={() => {}}
            isBackCard
          />
        )}
        <ModernCard key={cardKey} user={current} onSwipe={onSwipe} />
      </View>

      {/* Like / Dislike Buttons */}
      <View className="absolute bottom-48 right-3 gap-3">
        <TouchableOpacity
          onPress={() => onSwipe("right")}
          className="bg-white rounded-full p-1"
        >
          <Image
            source={require("@/assets/images/like.png")}
            className="w-14 h-14"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSwipe("left")}
          className="bg-white rounded-full p-1"
        >
          <Image
            source={require("@/assets/images/dislike.png")}
            className="w-14 h-14"
          />
        </TouchableOpacity>
      </View>

      {/* Rating Buttons */}
      <View className="absolute bottom-1 w-full items-center z-20">
        <RatingButtons rate={rate} onRateChange={setRate} />
      </View>
    </SafeAreaView>
  );
}
