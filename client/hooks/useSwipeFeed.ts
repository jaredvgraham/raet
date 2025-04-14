import { useState, useCallback } from "react";
import { useAuthFetch } from "@/hooks/Privatefetch";
import { Profile } from "@/types";

export function useSwipeFeed() {
  const authFetch = useAuthFetch();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [noProfilesLeft, setNoProfilesLeft] = useState(false);
  const [rate, setRate] = useState<number | null>(null);

  const fetchProfiles = useCallback(async () => {
    try {
      const res = await authFetch("/api/feed");
      const data = await res?.json();

      if (data.feed.length === 0) {
        setNoProfilesLeft(true);
        return;
      }
      console.log("Fetched profiles:", data.feed);

      setProfiles((prev) => [...prev, ...data.feed]);
      setNoProfilesLeft(false);
    } catch (err) {
      setNoProfilesLeft(true);
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  const handleSwipe = async (
    user: Profile,
    direction: "left" | "right",
    rate?: number
  ) => {
    console.log("swipe", user, direction, rate);

    setProfiles((prev) => prev.filter((p) => p._id !== user._id));

    try {
      const res = await authFetch("/api/feed/swipe", {
        method: "POST",
        body: JSON.stringify({ swipedId: user.clerkId, direction, rate }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res?.json();
      setRate(null);
      return data;
    } catch (err) {
      console.error("swipe error", err);
    }
  };

  return {
    profiles,
    loading,
    noProfilesLeft,
    fetchProfiles,
    handleSwipe,
    setRate,
    rate,
  };
}
