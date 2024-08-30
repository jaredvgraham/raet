import { useClerk } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Button } from "react-native";

export const SignOutButton = () => {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    console.log("signing out");

    await signOut();
    router.push("/(auth)/welcome");
  };

  return <Button title="Sign out" onPress={handleSignOut} />;
};
