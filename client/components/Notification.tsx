import React, { useEffect } from "react";
import { Text, Animated } from "react-native";

type NotificationProps = {
  visible: boolean;
  message: string;
  type: string;
  duration?: number;
  onHide?: () => void;
};

const Notification = ({
  visible,
  message,
  type = "success",
  duration = 3000,
  onHide,
}: NotificationProps) => {
  const slideAnim = new Animated.Value(-100);

  useEffect(() => {
    console.log("visible from noti", visible);

    if (visible) {
      // Slide in the notification
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Slide out the notification after the duration
      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onHide && onHide();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, slideAnim, onHide]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[{ transform: [{ translateY: slideAnim }] }]}
      className={`w-full  p-4 z-50 absolute top-0 left-0 right-0   ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      <Text className="text-white text-center text-base">{message}</Text>
    </Animated.View>
  );
};

export default Notification;
