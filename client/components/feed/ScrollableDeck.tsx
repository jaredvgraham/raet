import React, { useEffect, useState } from "react";
import { SafeAreaView, View, TouchableOpacity, Text } from "react-native";
import { useSwipeFeed } from "@/hooks/useSwipeFeed";
import { Profile } from "@/types";
import { Image } from "expo-image";

import FuturisticRatingButtons from "./FuturisticRating";
import FuturisticCard from "./ScrollableCard";
import ModernCard from "./ScrollableCard";
import RatingButtons from "./RateButtons";
import Header from "../header";

export default function FuturisticDeck() {
  const { profiles, loading, noProfilesLeft, fetchProfiles, handleSwipe } =
    useSwipeFeed();

  const [rate, setRate] = useState<number | null>(null);
  const [current, setCurrent] = useState<Profile | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (profiles.length > 0) setCurrent(profiles[0]);
    else setCurrent(null);
  }, [profiles]);

  if (loading || !current) return null;

  const onSwipe = (dir: "left" | "right") => {
    handleSwipe(current, dir, rate ?? undefined);
    setRate(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-100  ">
      <View className="p-3">
        <Text>hey</Text>
      </View>
      <View className="px-4 box p-2 h-[95%] relative">
        <ModernCard user={current} onImageTap={() => {}} />

        {/* Action Buttons */}

        <View className=" w-full  ">
          <RatingButtons rate={rate} onRateChange={setRate} />
        </View>
        <View className="absolute right-3 bottom-48 flex justify-evenly gap-2 ">
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
      </View>
    </SafeAreaView>
  );
}
