import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { router, useRouter } from "expo-router";
import OAuth from "@/components/OAuth";
import { useSignIn } from "@clerk/clerk-expo";

const SignIn = () => {
  const { signIn, isLoaded, setActive } = useSignIn();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onSignIn = useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(root)/(tabs)/home");
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, formData.email, formData.password]);

  return (
    <ScrollView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 p-6"
      >
        <View className="flex items-center mb-12">
          <Image
            source={require("../../assets/r-logo.png")}
            className="w-24 h-24 mb-4"
          />
          <Text className="text-3xl font-light text-gray-900">
            Welcome back!
          </Text>
        </View>

        <View className="space-y-6">
          {/* Email Input */}
          <View className="flex-row items-center border border-gray-300 rounded-full px-4 py-2 bg-gray-100 focus:border-blue-300">
            <View className="mr-2">
              <Icon name="envelope" size={20} color="gray" />
            </View>
            <TextInput
              placeholder="Email"
              placeholderTextColor="gray"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              className="flex-1 text-start text-gray-800"
              keyboardType="email-address"
            />
          </View>

          {/* Password Input */}
          <View className="flex-row items-center border border-gray-300 rounded-full px-4 py-2 bg-gray-100 focus:border-blue-300">
            <View className="mr-2">
              <Icon name="lock" size={20} color="gray" />
            </View>
            <TextInput
              placeholder="Password"
              placeholderTextColor="gray"
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
              secureTextEntry
              className="flex-1 text-start text-gray-800"
            />
          </View>

          {/* Sign Up Button */}

          <TouchableOpacity onPress={onSignIn} className="shadow-2xl">
            <View className="flex items-center justify-center w-full bg-blue-500 rounded-full py-3 ">
              <Text className="text-white text-lg font-semibold">Sign In</Text>
            </View>
          </TouchableOpacity>

          {/* OAuth*/}
          <OAuth />

          {/* Sign In */}
          <View className="mx-auto">
            <Text className="text-gray-500 text-center">
              Dont have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
              <Text className="text-blue-500 font-bold text-center ">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Verification Modal */}
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default SignIn;
