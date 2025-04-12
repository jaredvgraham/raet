import React from "react";
import { View, Text, Pressable } from "react-native";

type Props = {
  value: number | null;
  onChange: (val: number) => void;
};

export default function RatingSlider({ value, onChange }: Props) {
  return (
    <View className="flex-row justify-between px-2">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
        <Pressable
          key={num}
          onPress={() => onChange(num)}
          className={`w-8 h-8 rounded-full items-center justify-center ${
            value === num ? "bg-black" : "bg-gray-300"
          }`}
        >
          <Text
            className={`text-sm ${value === num ? "text-white" : "text-black"}`}
          >
            {num}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
