import { Dimensions } from "react-native";

import * as Location from "expo-location";
import { Platform } from "react-native";

export const SCREEN_WIDTH = Dimensions.get("window").width;
export const SCREEN_HEIGHT = Dimensions.get("window").height;

export async function getUserLocation() {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.log("Permission to access location was denied");
    return null;
  }

  let location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Highest,
  });

  if (location) {
    console.log(
      "User's Location:",
      location.coords.latitude,
      location.coords.longitude
    );

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  }

  return null;
}

// Call this function where needed in your component
