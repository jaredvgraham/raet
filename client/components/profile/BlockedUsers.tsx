import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  SafeAreaView,
} from "react-native";
import { Profile } from "@/types";
import Header from "../header";
import Icon from "react-native-vector-icons/FontAwesome";
import { Image } from "expo-image";
import { useAuthFetch } from "@/hooks/Privatefetch"; // Assuming this is a custom hook for authenticated fetch

type BlockedUsersProps = {
  initialBlockedUsers: Profile[]; // Change to initialBlockedUsers
  setShowBlockedUsers: React.Dispatch<React.SetStateAction<boolean>>;
};

const BlockedUsers = ({
  initialBlockedUsers,
  setShowBlockedUsers,
}: BlockedUsersProps) => {
  const [showUnblockModal, setShowUnblockModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null); // Store the selected user for unblock
  const [blockedUsers, setBlockedUsers] =
    useState<Profile[]>(initialBlockedUsers); // Manage blocked users state here
  const authFetch = useAuthFetch();

  // Function to handle the unblock action
  const handleUnblock = async () => {
    if (!selectedUser) return;

    try {
      const response = await authFetch("/api/block/unblock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blockedUserId: selectedUser.clerkId,
        }),
      });

      if (response.ok) {
        Alert.alert(
          "User Unblocked",
          `${selectedUser.name} has been unblocked.`
        );
        setShowUnblockModal(false);

        // Filter out the unblocked user
        setBlockedUsers((prevUsers) =>
          prevUsers.filter((user) => user.clerkId !== selectedUser.clerkId)
        );
        setSelectedUser(null); // Reset selected user after unblocking
      } else {
        const result = await response.json();
        Alert.alert("Error", result.message || "Failed to unblock user.");
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
      Alert.alert("Error", "An error occurred while unblocking the user.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header style="w-full flex items-center justify-center" />
      <Text className="text-xl font-bold text-center my-4">Blocked Users</Text>

      <FlatList
        data={blockedUsers}
        keyExtractor={(item) => item.clerkId}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedUser(item); // Set the user to be unblocked
              setShowUnblockModal(true); // Show the unblock modal
            }}
            className="flex-row items-center mb-4 p-3"
          >
            <Image
              source={{ uri: item.images[0] }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
            <Text className="ml-3 text-base text-gray-800">{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="flex items-center justify-center">
            <Text>No blocked users.</Text>
          </View>
        }
      />

      <TouchableOpacity
        onPress={() => setShowBlockedUsers(false)}
        className="bg-gray-300 p-4 rounded-lg mx-auto mt-4"
      >
        <Text className="text-center">Back to Profile</Text>
      </TouchableOpacity>

      {/* Unblock Confirmation Modal */}
      {selectedUser && (
        <Modal
          transparent={true}
          visible={showUnblockModal}
          animationType="slide"
        >
          <View className="flex-1 justify-center items-center  bg-opacity-50">
            <View className="bg-white p-5 rounded-lg w-80">
              <Text className="text-xl mb-4">
                Are you sure you want to unblock {selectedUser.name}?
              </Text>

              <View className="flex-row justify-between">
                {/* Unblock button */}
                <TouchableOpacity
                  onPress={handleUnblock}
                  className="bg-blue-500 p-2 rounded-lg"
                >
                  <Text className="text-white">Unblock</Text>
                </TouchableOpacity>

                {/* Cancel button */}
                <TouchableOpacity
                  onPress={() => setShowUnblockModal(false)}
                  className="bg-gray-300 p-2 rounded-lg"
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default BlockedUsers;
