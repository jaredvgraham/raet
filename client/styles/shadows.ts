// styles/shadows.ts
import { StyleSheet } from "react-native";

export const shadows = StyleSheet.create({
  softShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6, // for Android
  },
});
