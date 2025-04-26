import React from "react";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export const FloatingCreateButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    className="absolute bottom-6 right-4 bg-black/60 p-4 rounded-full shadow-md active:scale-95 border border-white/10"
    style={{ elevation: 8 }}
  >
    <Icon name="plus" size={20} color="white" />
  </TouchableOpacity>
);
