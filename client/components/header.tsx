import { View, Text, Image } from "react-native";
import React from "react";

const Header = () => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image
        source={require("../assets/r-logo.png")} // Update this path to your logo
        style={{ width: 40, height: 40 }}
        resizeMode="contain"
      />
    </View>
  );
};

export default Header;
