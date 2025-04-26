import { useState, useCallback } from "react";
import { useAuthFetch } from "@/hooks/Privatefetch";
import { Profile } from "@/types";

export function useSwipeFeed() {
  const authFetch = useAuthFetch();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [noneLeft, setNoneLeft] = useState(false);
  const [noProfilesLeft, setNoProfilesLeft] = useState(false);

  const [rate, setRate] = useState<number | null>(null);

  const fetchProfiles = useCallback(async () => {
    try {
      const res = await authFetch("/api/feed");
      const data = await res?.json();

      if (data.feed.length === 0) {
        setNoneLeft(true);
        return;
      }
      console.log("Fetched profiles:", data.feed);

      setProfiles((prev) => {
        const existingIds = new Set(prev.map((p) => p._id));
        const newProfiles = data.feed.filter(
          (profile: Profile) => !existingIds.has(profile._id)
        );
        return [...prev, ...newProfiles];
      });

      setNoProfilesLeft(false);
    } catch (err) {
      console.log("Error fetching profiles:", err);

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
    const profilesLength = profiles.length;

    setProfiles((prev) => prev.filter((p) => p._id !== user._id));

    try {
      const res = await authFetch("/api/feed/swipe", {
        method: "POST",
        body: JSON.stringify({ swipedId: user.clerkId, direction, rate }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res?.json();
      setRate(null);
      if (profilesLength <= 2 && !noneLeft) {
        fetchProfiles();
      }
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
    setNoProfilesLeft,
  };
}
