import React from "react";
import { View } from "react-native";

type RenderImageIndicatorsProps = {
  images: any[];
  currentImageIndex: number;
};

const RenderImageIndicators = ({
  images,
  currentImageIndex,
}: RenderImageIndicatorsProps) => {
  if (!images) {
    return null;
  }

  return (
    <View className="absolute top-10 left-0 right-0 flex-row justify-center">
      {images.map((_, index) => (
        <View
          key={index}
          className={`w-2 h-2 rounded-full mx-1 ${
            index === currentImageIndex ? "bg-white" : "bg-gray-500"
          }`}
        />
      ))}
    </View>
  );
};

export default RenderImageIndicators;
