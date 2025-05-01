import React, { createContext, useEffect, useState, useContext } from "react";
import * as Notifications from "expo-notifications";
import { router } from "expo-router"; // only if you want to navigate on tap

type NotificationData = {
  type: string;
  [key: string]: any;
} | null;

type NotificationContextType = {
  latestNotification: NotificationData;
  setLatestNotification: (data: NotificationData) => void;
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [latestNotification, setLatestNotification] =
    useState<NotificationData>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Foreground: Notification received
    const receivedSub = Notifications.addNotificationReceivedListener(
      (notification) => {
        const data = notification.request.content.data;
        console.log("Notification received", data);

        setLatestNotification(data as NotificationData);
        setVisible(true);
      }
    );

    // Background/terminated: Notification tapped
    const tapSub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        console.log("Notification tapped", data);

        // Optional: handle navigation or logic here
        if (data?.type === "new-message" && data?.matchId) {
          router.push(`/(root)/(chat)/${data.matchId}`);
        } else if (data?.type === "new-match") {
          router.push(`/(root)/(tabs)/chat`);
        }

        // Optionally set toast too
        setLatestNotification(data as NotificationData);
        setVisible(true);
      }
    );

    // Cleanup
    return () => {
      receivedSub.remove();
      tapSub.remove();
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{ latestNotification, setLatestNotification, visible, setVisible }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error("useNotification must be used within NotificationProvider");
  return context;
};
