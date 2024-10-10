import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { useAuth, useSession, useUser } from "@clerk/clerk-expo";
import { useAuthFetch } from "@/hooks/Privatefetch";
import "react-native-gesture-handler";

//has profile logic soon

const Home = () => {
  const { isSignedIn } = useAuth();
  const { session } = useSession();

  const authFetch = useAuthFetch();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isSignedIn || !session) {
          setHasProfile(false);
          return;
        }

        const response = await authFetch("/api/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response?.json();

        if (data.hasProfile === true) {
          setHasProfile(true);
        } else {
          setHasProfile(false);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setHasProfile(false);
        console.log("error msg", error, "ENDDDDDD");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isSignedIn, session]);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isSignedIn && hasProfile) {
    return <Redirect href={"/(root)/(tabs)/home"} />;
  } else if (isSignedIn && !hasProfile) {
    return <Redirect href={"/(setUp)/onboarding"} />;
  }

  return <Redirect href="/(auth)/welcome" />;
};

export default Home;
