import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, Pressable } from "react-native";

type RatingButtonsProps = {
  rate: number | null;
  onRateChange: (number: number) => void;
  isCurrentCard: boolean;
};

const RatingButtons = ({
  rate,
  onRateChange,
  isCurrentCard = true,
}: RatingButtonsProps) => {
  return (
    <View
      className="flex-row justify-between p-1  w-full"
      style={{
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      }}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => {
        const isSelected = rate === number && isCurrentCard;

        return (
          <Pressable key={number} onPress={() => onRateChange(number)}>
            {isSelected ? (
              <View className="p-[11px] bg-teal-500 shadow-lg rounded-md">
                <Text className="text-sm font-medium text-white">{number}</Text>
              </View>
            ) : (
              <View className="p-[11px] bg-gray-600/70 shadow-lg rounded-md">
                <Text className="text-sm font-medium text-white">{number}</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

export default RatingButtons;
