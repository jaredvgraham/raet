import { useEffect, useState, useRef } from "react";
import { ref, onChildAdded } from "firebase/database";
import { useAuth } from "@clerk/clerk-expo";
import { db } from "@/services/firebaseConfig";
import { useAuthFetch } from "@/hooks/Privatefetch";
import { Message, Profile } from "@/types";

export const useChat = (matchId: string | string[]) => {
  const { userId } = useAuth();
  const authFetch = useAuthFetch();

  const [messages, setMessages] = useState<Message[]>([]);
  const [gotMessages, setGotMessages] = useState(false);
  const [match, setMatch] = useState<Profile | null>(null);

  useEffect(() => {
    const chatRef = ref(db, `chats/${matchId}`);
    onChildAdded(chatRef, (snapshot) => {
      const msg = snapshot.val();
      setMessages((prev) => [...prev, msg]);
      setGotMessages(true);
    });
  }, [matchId]);

  useEffect(() => {
    const fetchMatch = async () => {
      const res = await authFetch(`/api/match/${matchId}`);
      const data = await res.json();
      setMatch({
        ...data.matchProfile,
        distance: data.distance,
        age: data.age,
      });
    };
    fetchMatch();
  }, [matchId]);

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg) return;

    const markAsRead = async () => {
      if (lastMsg.senderId === userId || lastMsg.receiverViewed) return;

      try {
        await authFetch(`/api/chat/message/read/${lastMsg.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ matchId }),
        });
      } catch (err) {
        console.error("Error marking message as read", err);
      }
    };

    markAsRead();
  }, [messages]); // rerun when messages change

  return { messages, match, setMessages };
};
