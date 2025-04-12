import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

type Props = {
  rate: number | null;
  onRateChange: (n: number) => void;
};

export default function FuturisticRatingButtons({ rate, onRateChange }: Props) {
  return (
    <View className="flex-row justify-around w-full px-10 py-4">
      {[1, 2, 3, 4, 5].map((num) => (
        <TouchableOpacity
          key={num}
          onPress={() => onRateChange(num)}
          className={`rounded-full w-12 h-12 items-center justify-center ${
            rate === num ? "bg-purple-600" : "bg-white/10"
          }`}
        >
          <Text className="text-white font-bold">{num}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
