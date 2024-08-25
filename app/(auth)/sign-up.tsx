import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import React from "react";

const SignUp = () => {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="bg-gray-50 ">
          <Image
            source={require("../../assets/r-logo.png")}
            className="w-28 h-28 mx-auto"
          />
          <Text className="text-center text-2xl font-thin text-gray-800">
            Create an account
          </Text>
        </View>
        <View className="p-5">
          <KeyboardAvoidingView>
            <Text className="text-gray-500 text-sm">Name</Text>
            <TextInput
              placeholder="Name"
              className="border-b-2 border-gray-200"
            />

            <Text className="text-gray-500 text-sm">Email</Text>
            <TextInput
              placeholder="Email"
              className="border-b-2 border-gray-200"
            />
          </KeyboardAvoidingView>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUp;
