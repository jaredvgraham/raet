import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Image } from "expo-image";

type HeaderProps = {
  backArrow?: boolean;
  backDestination?: string;
  image?: string;
  userName?: string;
  style?: string;
};

const Header = ({ backArrow, backDestination, image, style }: HeaderProps) => {
  const router = useRouter();

  const handleBackPress = () => {
    if (backDestination) {
      router.push(backDestination as any);
    } else {
      router.back();
    }
  };

  return (
    <View
      className={`flex flex-row items-center justify-between px-3 h-11 ${style}`}
    >
      {backArrow && (
        <TouchableOpacity onPress={handleBackPress} style={{ width: 40 }}>
          <Icon
            name="angle-left"
            size={40}
            color="black"
            style={{ transform: [{ scaleX: 0.8 }] }}
          />
        </TouchableOpacity>
      )}

      <Image
        source={require("../assets/r-logo.png")} // Update this path to your logo
        style={{ width: 40, height: 40 }}
      />

      {image && (
        <View style={{ width: 40 }}>
          <Image
            source={{ uri: image }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        </View>
      )}
    </View>
  );
};

export default Header;
