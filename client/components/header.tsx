import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome"; // Using FontAwesome as an example

type HeaderProps = {
  backArrow?: boolean;
  backDestination?: string; // Optional prop to specify where the back button should navigate
};

const Header = ({ backArrow, backDestination }: HeaderProps) => {
  const router = useRouter();

  const handleBackPress = () => {
    if (backDestination) {
      router.push(backDestination as any); // Navigate to the specified destination
    } else {
      router.back(); // Go back to the previous screen
    }
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {backArrow && (
        <TouchableOpacity
          onPress={handleBackPress}
          style={{ position: "absolute", left: 10 }}
        >
          <Icon name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
      )}
      <Image
        source={require("../assets/r-logo.png")} // Update this path to your logo
        style={{ width: 40, height: 40 }}
        resizeMode="contain"
      />
    </View>
  );
};

export default Header;
