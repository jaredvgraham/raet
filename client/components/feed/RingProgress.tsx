import React from "react";
import { View, Text } from "react-native";
import { Circle, Svg } from "react-native-svg";

type Props = {
  percentage: number;
  size?: number;
};

export default function RingProgress({ percentage, size = 70 }: Props) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (percentage / 100) * circumference || 0;

  // 🧠 Convert percentage to a hue (0 = red, 120 = green, 180 = teal)
  const getHSLColor = (pct: number) => {
    const clamped = Math.max(0, Math.min(100, pct));
    // Map 0–100% to a hue from 0 (red) to 130 (emerald)
    const hue = (clamped / 100) * 130;
    return `hsl(${hue}, 85%, 55%)`;
  };

  const progressColor = getHSLColor(percentage);

  return (
    <View
      className="items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <Svg width={size} height={size}>
        {/* Track */}
        <Circle
          stroke="#E5E7EB"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        {/* Progress */}
        <Circle
          stroke={progressColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`} // Starts from top
        />
      </Svg>

      <View className="absolute items-center justify-center">
        <Text className="text-white font-bold text-sm">{percentage}%</Text>
        <Text className="text-white text-xs">Match</Text>
      </View>
    </View>
  );
}
