import { Dimensions } from "react-native";

import * as Location from "expo-location";
import { Platform } from "react-native";

export const SCREEN_WIDTH = Dimensions.get("window").width;
export const SCREEN_HEIGHT = Dimensions.get("window").height;

export async function getUserLocation() {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.log("Permission to access location was denied");
    return;
  }

  let location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Highest,
  });

  console.log(
    "User's Location:",
    location.coords.latitude,
    location.coords.longitude
  );
  // Save the latitude and longitude to the user profile or use as needed
}

// Call this function where needed in your component
