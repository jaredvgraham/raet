import { Dimensions } from "react-native";

import * as Location from "expo-location";
import { Platform } from "react-native";

export const SCREEN_WIDTH = Dimensions.get("window").width;
export const SCREEN_HEIGHT = Dimensions.get("window").height;

export async function getUserLocation() {
  console.log("Getting user's location...");

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

export const getCityFromLocation = async (
  latitude: number,
  longitude: number
) => {
  try {
    let reverseGeocode = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (reverseGeocode.length > 0) {
      let city = reverseGeocode[0].city;
      let region = reverseGeocode[0].region;
      let country = reverseGeocode[0].country;

      console.log(`City: ${city}, Region: ${region}, Country: ${country}`);
      return { city, region, country };
    }
  } catch (error) {
    console.error(error);
  }
};
