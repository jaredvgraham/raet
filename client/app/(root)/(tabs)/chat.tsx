import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native";
import Notification from "@/components/Notification"; // Adjust the import path as necessary

export default function NotificationDemo() {
  const [showNotification, setShowNotification] = useState({
    visible: true,
    message: "Welcome to the app! 🎉",
    type: "success",
  });

  useEffect(() => {
    // Optionally hide the notification after a few seconds
    const timer = setTimeout(() => {
      setShowNotification({
        visible: false,
        message: "",
        type: "success",
      });
    }, 3000); // Hide after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      {showNotification.visible && (
        <Notification
          {...showNotification}
          onHide={() =>
            setShowNotification({
              visible: false,
              message: "",
              type: "success",
            })
          }
        />
      )}
    </SafeAreaView>
  );
}
