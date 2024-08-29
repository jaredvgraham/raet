import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { useAuth, useSession } from "@clerk/clerk-expo";
import { useAuthFetch } from "@/hooks/Privatefetch";

//has profile logic soon

const Home = () => {
  const { isSignedIn } = useAuth();
  const { session } = useSession();
  const authFetch = useAuthFetch();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (isSignedIn) {
        try {
          const response = await authFetch("/api/user/profile", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response?.json();

          setHasProfile(data?.hasProfile ?? false);
        } catch (error) {
          console.error("Error fetching profile:", error);
          setHasProfile(false);
        }
      }
    };

    fetchData();
  }, [isSignedIn, session]);

  if (hasProfile === null) {
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
