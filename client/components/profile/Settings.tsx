import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React from "react";
import { SignOutButton } from "../SignOut";
import DeleteAccount from "./DeleteAccount";
import { Profile } from "@/types";
import { useUser } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";

type SettingsProps = {
  profile: Profile;
  setSettings: () => void;
};

const Settings = ({ profile, setSettings }: SettingsProps) => {
  const { user } = useUser();
  const router = useRouter();

  const openInAppBrowser = async (url: string) => {
    await WebBrowser.openBrowserAsync(url);
  };

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3 bg-white border-b border-gray-200">
        <Text className="text-lg font-semibold text-gray-800">Settings</Text>
        <TouchableOpacity onPress={setSettings}>
          <Text className="text-[#10b5b1]">Done</Text>
        </TouchableOpacity>
      </View>

      {/* Your Plan */}
      {user?.publicMetadata && (
        <TouchableOpacity
          onPress={() => router.push("/(root)/(pay)/plans")}
          className="bg-gray-50 mx-4 mt-4 p-4 rounded-xl flex-row justify-between items-center border border-gray-200 active:opacity-80"
        >
          <View className="flex-row items-center gap-3">
            <Icon name="card-outline" size={22} color="#10b5b1" />
            <View>
              <Text className="text-base font-semibold text-gray-800">
                Your Plan
              </Text>
              <Text className="text-sm text-gray-500">
                {(user.publicMetadata.plan as string) || "Free"}
              </Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={18} color="#aaa" />
        </TouchableOpacity>
      )}

      {/* Profile */}
      <View className="bg-gray-50 mx-4 mt-4 p-4 rounded-xl border border-gray-200">
        <View className="flex-row items-center gap-3 mb-1">
          <Icon name="person-outline" size={20} color="#10b5b1" />
          <Text className="text-base font-semibold text-gray-800">Profile</Text>
        </View>
        <Text className="text-gray-600">Name: {profile.name}</Text>
        <Text className="text-gray-600">Email: {profile.email}</Text>
      </View>

      {/* Legal */}
      <View className="bg-gray-50 mx-4 mt-4 p-4 rounded-xl border border-gray-200">
        <View className="flex-row items-center gap-3 mb-1">
          <Icon name="document-text-outline" size={20} color="#10b5b1" />
          <Text className="text-base font-semibold text-gray-800">Legal</Text>
        </View>

        <TouchableOpacity
          className="flex-row justify-between items-center mt-2"
          onPress={() => openInAppBrowser("https://raet.io/privacy-policy")}
        >
          <Text className="text-blue-500">Privacy Policy</Text>
          <Icon name="chevron-forward" size={16} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row justify-between items-center mt-2"
          onPress={() => openInAppBrowser("https://raet.io/terms")}
        >
          <Text className="text-blue-500">Terms of Service</Text>
          <Icon name="chevron-forward" size={16} color="#aaa" />
        </TouchableOpacity>
      </View>

      {/* Support */}
      {/* 
      <View className="bg-gray-50 mx-4 mt-4 p-4 rounded-xl border border-gray-200">
        <View className="flex-row items-center gap-3 mb-1">
          <Icon name="help-circle-outline" size={20} color="#10b5b1" />
          <Text className="text-base font-semibold text-gray-800">Support</Text>
        </View>

        <TouchableOpacity
          className="flex-row justify-between items-center mt-2"
          onPress={() => openInAppBrowser("https://raet.io/support")}
        >
          <Text className="text-blue-500">Contact Us</Text>
          <Icon name="chevron-forward" size={16} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row justify-between items-center mt-2">
          <Text className="text-blue-500">FAQ</Text>
          <Icon name="chevron-forward" size={16} color="#aaa" />
        </TouchableOpacity>
      </View>
      */}

      {/* Auth Buttons */}
      <View className="mt-6 px-6">
        <SignOutButton />
        <DeleteAccount userId={profile.clerkId} />
      </View>

      {/* Footer */}
      <View className="mt-auto pb-6 px-6">
        <Text className="text-xs text-center text-gray-400">Raet v1.0</Text>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
