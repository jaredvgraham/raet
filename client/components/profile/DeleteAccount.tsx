import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { useAuthFetch } from "@/hooks/Privatefetch";
import { router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import Icon from "react-native-vector-icons/Ionicons";

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
    <TouchableOpacity
      onPress={confirmDeletion}
      className="flex-row items-center justify-center gap-2 border border-red-500  pb-2 rounded-xl mt-3 active:opacity-80"
    >
      <Icon name="trash-outline" size={18} color="#ef4444" />
      <Text className="text-red-500 font-semibold text-base">
        Delete Account
      </Text>
    </TouchableOpacity>
  );
};

export default DeleteAccount;
