import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useNotification } from "@/hooks/useNotifications";

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

  if (!visible || !latestNotification) return null;

  return (
    <Animated.View
      className="absolute z-50 top-0 self-center bg-black px-4 py-3 rounded-lg shadow-md flex-row items-center"
      style={{
        transform: [{ translateY }],
        width: width * 0.9,
        marginTop: 5,
      }}
    >
      <Text className="text-white flex-1 text-center font-medium">
        {getNotificationMessage(latestNotification)}
      </Text>
      <TouchableOpacity onPress={() => setVisible(false)}>
        <Text className="text-white ml-2">✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Toast;
