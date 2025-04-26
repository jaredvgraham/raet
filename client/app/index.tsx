import { View, Text, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { useAuth, useSession, useUser } from "@clerk/clerk-expo";
import { useAuthFetch } from "@/hooks/Privatefetch";
import "react-native-gesture-handler";
import Loading from "@/components/Loading";

//has profile logic soon

const Home = () => {
  console.log("App is running");
  console.log("Home screen");

  const { isSignedIn } = useAuth();
  const { session } = useSession();
  const { user } = useUser();

  const authFetch = useAuthFetch();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      console.log("fetching profile");
      console.log("isSignedIn", isSignedIn);

      try {
        if (!isSignedIn || !session) {
          console.log("User is not signed in or session is not available");
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
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Loading />
      </SafeAreaView>
    );
  }

  if (isSignedIn && hasProfile) {
    console.log("User is signed in and has a profile");
    return <Redirect href={"/(root)/(tabs)/home"} />;
  } else if (isSignedIn && !hasProfile) {
    console.log("User is signed in but has no profile");
    return <Redirect href={"/(setUp)/onboarding"} />;
  }
  console.log("User is not signed in");

  return <Redirect href="/(auth)/welcome" />;
};

export default Home;
