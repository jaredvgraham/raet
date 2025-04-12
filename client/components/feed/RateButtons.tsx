import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

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
      className="flex-row justify-between p-1 pt-2 w-full "
      style={{
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      }}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
        <TouchableOpacity
          className={`${
            rate === number && isCurrentCard ? "bg-teal-300" : "bg-white"
          }  p-2 min-w-[30px] rounded-lg border border-gray-300 shadow-sm`}
          key={number}
          onPress={() => onRateChange(number)}
        >
          <Text className="text-center text-gray-500">{number}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RatingButtons;
