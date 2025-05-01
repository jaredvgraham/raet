import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Text, TouchableOpacity } from "react-native";
import { useNotification } from "@/hooks/useNotifications";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const getNotificationMessage = (notif: { type?: string } | null) => {
  switch (notif?.type) {
    case "new-match":
      return "You’ve got a new match 💘";
    case "new-message":
      return "You’ve received a new message 📩";
    case "generic":
      return "You have a new notification!";
    default:
      return "Notification received!";
  }
};

const Toast = () => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const { latestNotification, visible, setVisible } = useNotification();

  useEffect(() => {
    console.log("notification visable:", latestNotification);

    if (visible) {
      Animated.spring(translateY, {
        toValue: 60,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.spring(translateY, {
            toValue: -100,
            useNativeDriver: true,
          }).start(() => {
            setVisible(false);
          });
        }, 3000);
      });
    }
  }, [visible]);

  const handleToastPress = () => {
    setVisible(false);

    if (
      latestNotification?.type === "new-message" &&
      latestNotification?.matchId
    ) {
      // Navigate to the chat screen with the matchId
      router.push(`/(root)/(chat)/${latestNotification.matchId}`);
    } else if (latestNotification?.type === "new-match") {
      router.push(`/(root)/(tabs)/chat`);
    }
  };

  if (!visible || !latestNotification) return null;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handleToastPress}>
      <Animated.View
        className="absolute z-50 top-0 self-center bg-black px-4 py-3 rounded-lg shadow-md flex-row items-center"
        style={{
          transform: [{ translateY }],
          width: width * 0.9,
          marginTop: 5,
          zIndex: 1000,
        }}
      >
        <Text className="text-white flex-1 text-center font-medium">
          {getNotificationMessage(latestNotification)}
        </Text>
        <Text className="text-white ml-2">✕</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default Toast;
