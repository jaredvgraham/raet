// components/Loading.tsx

import React from "react";
import { View, ActivityIndicator, Text } from "react-native";

const Loading = ({ message }: { message?: string }) => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      {/* Spinner */}
      <ActivityIndicator size="large" color="#14b8a6" />

      {/* Message */}
      {message && (
        <Text className="mt-4 text-gray-700 text-base font-semibold">
          {message}
        </Text>
      )}
    </View>
  );
};

export default Loading;
