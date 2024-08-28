import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";

const OAuth = () => {
  const handleGoogleSignIn = async () => {
    console.log("Google Sign In");
  };

  return (
    <View>
      <View className="flex-row justify-center items-center mt-4">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="text-gray-500 mx-3">or</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      {/* Sign in with Google */}
      <TouchableOpacity
        className="my-5 flex-row items-center justify-center w-full bg-white rounded-full py-3 border border-gray-300"
        onPress={handleGoogleSignIn}
      >
        <Image
          source={require("../assets/google-icon.webp")}
          className="w-6 h-6 mr-2"
        />
        <Text className="text-black text-lg font-semibold">
          Continue with Google
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OAuth;
