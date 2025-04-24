import { useClerk } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export const SignOutButton = () => {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    console.log("signing out");

    await signOut();
    router.push("/(auth)/welcome");
  };

  return (
    <TouchableOpacity
      onPress={handleSignOut}
      className="flex-row items-center justify-center gap-2 bg-black pb-2 rounded-xl mt-4 active:opacity-80"
    >
      <Icon name="log-out-outline" size={18} color="white" />
      <Text className="text-white font-semibold text-base">Sign Out</Text>
    </TouchableOpacity>
  );
};
