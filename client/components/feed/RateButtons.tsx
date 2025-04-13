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
      className="flex-row justify-between p-1 pt-2 w-full"
      style={{
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      }}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => {
        const isSelected = rate === number && isCurrentCard;

        return (
          <Pressable
            key={number}
            onPress={() => onRateChange(number)}
            className={`p-3  rounded-lg  ${
              isSelected
                ? "bg-teal-500 border-teal-500 shadow-lg"
                : "bg-white shadow-sm"
            }`}
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.94 : 1 }],
              shadowColor: isSelected ? "#14b8a6" : "#000",
              shadowOpacity: isSelected ? 0.3 : 0.1,
              shadowRadius: isSelected ? 8 : 2,
              shadowOffset: { width: 0, height: 2 },
              elevation: isSelected ? 6 : 1,
            })}
          >
            <Text
              className={`text-center text-md ${
                isSelected ? "text-white font-semibold " : "text-gray-600 "
              }`}
            >
              {number}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default RatingButtons;
