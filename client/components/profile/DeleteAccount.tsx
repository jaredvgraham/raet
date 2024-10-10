import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { useAuthFetch } from "@/hooks/Privatefetch";
import { router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

type DeleteAccountProps = {
  userId: string;
};

const DeleteAccount = ({ userId }: DeleteAccountProps) => {
  const authFetch = useAuthFetch();
  const { signOut } = useAuth();

  const handleDel = async () => {
    try {
      const response = await authFetch(`/api/user/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("response", response);
      await signOut();
      router.push("/");
      console.log("Account deleted");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const confirmDeletion = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.", // Message
      [
        {
          text: "Cancel",
          onPress: () => console.log("Account deletion canceled"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: handleDel,
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View className="flex items-center">
      <TouchableOpacity
        onPress={confirmDeletion}
        className="bg-black p-2 rounded-lg mt-2"
      >
        <Text className="text-gray-200">Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DeleteAccount;
