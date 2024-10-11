import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
} from "react-native";
// Custom hook for authenticated fetch
import { Entypo } from "@expo/vector-icons"; // For the three-dot icon
import { useAuthFetch } from "@/hooks/Privatefetch";
import { router } from "expo-router";

type UserActionsMenuProps = {
  reportedUserId: string; // The user being reported
  color?: string; // Optional color for the icon
};

const UserActionsMenu = ({
  reportedUserId,
  color = "black",
}: UserActionsMenuProps) => {
  const [menuVisible, setMenuVisible] = useState(false); // Main menu visibility
  const [reportModalVisible, setReportModalVisible] = useState(false); // Report reason modal visibility
  const [reportReason, setReportReason] = useState(""); // Report reason state
  const authFetch = useAuthFetch(); // Hook for authenticated requests

  // Function to toggle the visibility of the menu
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  // Function to toggle the report reason modal
  const toggleReportModal = () => {
    console.log("toggleReportModal", reportModalVisible);
    setMenuVisible(!menuVisible);
    setReportModalVisible(!reportModalVisible);
  };

  // Function to handle the block action
  const handleBlock = async () => {
    try {
      const res = await authFetch("/api/block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blockedUserId: reportedUserId, // The user being blocked
        }),
      });
      const result = await res.json();

      console.log("result", result);

      Alert.alert("User Blocked", "The user has been blocked successfully.");
      router.push("/");
    } catch (error) {
      console.error("Error blocking user:", error);
      Alert.alert("Error", "An error occurred while blocking the user.");
    }
  };

  // Function to handle the report action
  const handleReportSubmit = async () => {
    try {
      const response = await authFetch("/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportedUserId: reportedUserId, // The user being reported
          reason: reportReason, // User-provided reason
        }),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert(
          "Report Submitted",
          "The report has been submitted successfully."
        );
      } else {
        Alert.alert("Error", result.message || "Failed to submit the report.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while submitting the report.");
      console.error("Error reporting user:", error);
    } finally {
      setReportModalVisible(false); // Close the report modal after submission
      toggleMenu(); // Close the main menu
    }
  };

  return (
    <View className="relative">
      {/* Three Dots Icon */}
      <TouchableOpacity onPress={toggleMenu}>
        <Entypo name="dots-three-horizontal" size={24} color={color} />
      </TouchableOpacity>

      {/* Main Menu Modal */}
      {menuVisible && (
        <Modal transparent={true} visible={menuVisible} animationType="fade">
          <TouchableOpacity style={{ flex: 1 }} onPress={toggleMenu}>
            <Text> </Text>
            {/* Close when clicking outside */}
            <View className="absolute top-10 right-5 bg-white shadow-lg rounded-lg p-4">
              {/* Block User Option */}
              <TouchableOpacity onPress={handleBlock} className="mb-4">
                <Text className="text-red-500">Block User</Text>
              </TouchableOpacity>

              {/* Report User Option */}
              <TouchableOpacity onPress={toggleReportModal}>
                <Text className="text-blue-500">Report User</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Report Reason Modal */}
      {reportModalVisible && (
        <Modal
          transparent={true}
          visible={reportModalVisible}
          animationType="slide"
        >
          <View className="flex-1 justify-center items-center bg-slate-300 bg-opacity-50 z-50">
            <View className="bg-white p-5 rounded-lg w-80">
              <Text className="text-xl mb-4">
                Why are you reporting this user?
              </Text>

              {/* Input field for the report reason */}
              <TextInput
                placeholder="Enter reason..."
                value={reportReason}
                onChangeText={setReportReason}
                className="border border-gray-300 rounded-lg p-2 mb-4"
                multiline
              />

              {/* Report and Cancel buttons */}
              <View className="flex-row justify-between">
                <TouchableOpacity
                  onPress={handleReportSubmit}
                  className="bg-blue-500 p-2 rounded-lg"
                >
                  <Text className="text-white">Submit Report</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={toggleReportModal}
                  className="bg-gray-300 p-2 rounded-lg"
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default UserActionsMenu;
