type NotificationType = "new-message" | "new-match" | "generic";

interface PushPayload {
  to: string; // Expo push token
  title: string;
  body: string;
  data?: {
    type: NotificationType;
    [key: string]: any;
  };
}

export const sendPushNotification = async ({
  to,
  title,
  body,
  data,
}: PushPayload) => {
  try {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        sound: "default",
        title,
        body,
        data,
      }),
    });

    console.log("Push notification sent successfully");
  } catch (error) {
    console.error("Failed to send push notification:", error);
  }
};
