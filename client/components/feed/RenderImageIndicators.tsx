import React from "react";
import { View } from "react-native";

type RenderImageIndicatorsProps = {
  images: string[];
  currentImageIndex: number; // Add this prop
};

const RenderImageIndicators = ({
  images,
  currentImageIndex,
}: RenderImageIndicatorsProps) => {
  if (!images || images.length === 0) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: 10,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      {images.map((_, index) => (
        <View
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: index === currentImageIndex ? "white" : "gray",
            marginHorizontal: 3,
          }}
        />
      ))}
    </View>
  );
};

export default RenderImageIndicators;
