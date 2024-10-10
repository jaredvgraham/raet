import {
  View,
  Text,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Alert,
} from "react-native";
import CheckBox from "react-native-check-box";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { router } from "expo-router";
import { Image } from "expo-image";

import { useSignUp } from "@clerk/clerk-expo";
import ReactNativeModal from "react-native-modal";
import TermsModal from "@/components/TosModal";

const SignUp = () => {
  const { signUp, isLoaded, setActive } = useSignUp();
  const [acceptTOS, setAcceptTOS] = useState(false);
  const [showTOSModal, setShowTOSModal] = useState(false);

  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [pendingVerification, setPendingVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const onSignUp = async () => {
    if (!isLoaded) {
      return;
    }

    if (!acceptTOS) {
      setError("Please accept the terms of service");
      return;
    }

    try {
      await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification({
        ...pendingVerification,
        state: "pending",
      });
    } catch (err: any) {
      Alert.alert("Error", err.errors[0].longMessage);
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: pendingVerification.code,
      });

      if (completeSignUp.status === "complete") {
        // TODO handle add user to database

        try {
          const res = await fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/api/user/sign-up`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                clerkId: completeSignUp.createdUserId,
              }),
            }
          );
          console.log("sign up res", res);

          await setActive({ session: completeSignUp.createdSessionId });
          setPendingVerification({
            ...pendingVerification,
            state: "success",
          });
        } catch (error: any) {
          if (error.errors[0].code === "session_exists") {
            setError("User already exists");
          }
          if (error.errors[0].code === "form_code_incorrect") {
            setError("Invalid code");
          }
        }
      } else {
        setPendingVerification({
          ...pendingVerification,
          state: "faild",
          error: "Validation failed",
        });
      }
    } catch (err: any) {
      setPendingVerification({
        ...pendingVerification,
        state: "faild",
        error: err.errors[0].longMessage,
      });
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-white pt-10">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
          className="flex-1 p-6"
        >
          <View className="flex items-center mb-12">
            <Image
              source={require("../../assets/r-logo.png")}
              className="w-24 h-24 mb-4"
            />
            <Text className="text-3xl font-light text-gray-900">
              Create an account!
            </Text>
          </View>

          <View className="space-y-6">
            {/* Name Input */}

            <View className="flex-row items-center border border-gray-300 rounded-full px-4  bg-gray-100 focus:border-blue-300">
              <View className="mr-2">
                <Icon name="user" size={20} color="gray" />
              </View>
              <TextInput
                placeholder="Name"
                placeholderTextColor="gray"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
                className="flex-1 text-start text-gray-800 py-2 "
              />
            </View>

            {/* Email Input */}
            <View className="flex-row items-center border border-gray-300 rounded-full px-4  bg-gray-100 focus:border-blue-300">
              <View className="mr-2">
                <Icon name="envelope" size={20} color="gray" />
              </View>
              <TextInput
                placeholder="Email"
                placeholderTextColor="gray"
                value={formData.email}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
                className="flex-1 text-start text-gray-800 py-2"
                keyboardType="email-address"
              />
            </View>

            {/* Password Input */}
            <View className="flex-row items-center border border-gray-300 rounded-full px-4   bg-gray-100 focus:border-blue-300">
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
                className="flex-1 text-start text-gray-800 py-2"
              />
            </View>

            {/* Accept TOS Section */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <CheckBox
                isChecked={acceptTOS}
                onClick={() => setAcceptTOS(!acceptTOS)}
              />
              <Text style={{ marginLeft: 8 }}>I accept the</Text>
              <TouchableOpacity onPress={() => setShowTOSModal(true)}>
                <Text style={{ color: "teal", marginLeft: 5 }}>
                  Terms of Service
                </Text>
              </TouchableOpacity>
            </View>

            {/* TOS Modal */}

            <TermsModal
              visible={showTOSModal}
              onClose={() => setShowTOSModal(false)}
            />

            {/* Sign Up Button */}

            <TouchableOpacity onPress={onSignUp} className="shadow-2xl">
              <View className="flex items-center justify-center w-full bg-teal-300 rounded-full py-3 ">
                <Text className="text-white text-lg font-semibold">
                  Sign Up
                </Text>
              </View>
            </TouchableOpacity>

            {error && (
              <Text className="text-red-500 text-sm text-center">{error}</Text>
            )}

            {/* OAuth*/}

            {/* Sign In */}
            <View className="ml-2">
              <Text className="text-gray-500">Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")}>
                <Text className="text-teal-300 font-bold ">Sign In</Text>
              </TouchableOpacity>
            </View>

            {/* Verification Modal */}

            <ReactNativeModal
              isVisible={pendingVerification.state === "pending"}
              onModalHide={() => {
                if (pendingVerification.state === "success") {
                  setShowSuccessModal(true);
                }
              }}
            >
              <View className=" bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                <Text className="text-2xl text-center font-semibold">
                  Verify your email
                </Text>
                <Text className="text-base text-gray-400 text-center mt-2">
                  We have sent a verification code to your email address{" "}
                  {formData.email}. Please enter the code below.
                </Text>
                <View className="flex-row items-center border border-gray-300 rounded-full px-4 py-2 bg-gray-100 focus:border-blue-300 mt-5">
                  <View className="mr-2">
                    <Icon name="lock" size={20} color="gray" />
                  </View>
                  <TextInput
                    placeholder="12345"
                    placeholderTextColor="gray"
                    value={pendingVerification.code}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                      setPendingVerification({
                        ...pendingVerification,
                        code: text,
                      })
                    }
                    className="flex-1 text-start text-gray-800"
                  />
                  {pendingVerification.error && (
                    <Text className="text-red-500 text-sm">
                      {pendingVerification.error}
                    </Text>
                  )}
                </View>
                <TouchableOpacity onPress={onPressVerify} className="mt-5">
                  <View className="flex items-center justify-center w-full bg-green-500 rounded-full py-3 ">
                    <Text className="text-white text-lg font-semibold">
                      Verify
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ReactNativeModal>

            <ReactNativeModal isVisible={showSuccessModal}>
              <View className=" bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                <View className="mx-auto my-5">
                  <Icon name="check-circle" size={100} color="green" />
                </View>
                <Text className="text-2xl text-center font-semibold">
                  Verified
                </Text>
                <Text className="text-base text-gray-400 text-center mt-2">
                  Your email has been verified successfully!
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowSuccessModal(false);
                    router.push("/(setUp)/onboarding");
                  }}
                  className="mt-5"
                >
                  <View className="flex items-center justify-center w-full bg-blue-500 rounded-full py-3 ">
                    <Text className="text-white text-lg font-semibold">
                      Get Started
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ReactNativeModal>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignUp;
