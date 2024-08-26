import React from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { SafeAreaView, Text, View, Image, ScrollView } from "react-native";

export const users = [
  {
    id: 1,
    name: "Emily Johnson",
    age: 28,
    location: "New York, NY",
    bio: "Love exploring the city, trying new restaurants, and reading mystery novels.",
    interests: ["Traveling", "Photography", "Yoga"],
    images: [
      {
        imgUrl: require("../../../assets/images/wom2.jpeg"),
      },
      {
        imgUrl: require("../../../assets/images/wom5.jpeg"),
      },
    ],
  },
  {
    id: 2,
    name: "Sophia Martinez",
    age: 26,
    location: "Los Angeles, CA",
    bio: "Actress by day, fitness enthusiast by night. Let's go on an adventure!",
    interests: ["Hiking", "Fitness", "Movies"],
    images: [
      {
        imgUrl: require("../../../assets/images/wom3alt.jpeg"),
      },
      {
        imgUrl: require("../../../assets/images/wom6alt.jpeg"),
      },
    ],
  },
  {
    id: 3,
    name: "Olivia Brown",
    age: 30,
    location: "Chicago, IL",
    bio: "Tech geek and coffee lover. Always up for a good conversation.",
    interests: ["Technology", "Coffee", "Running"],
    images: [
      {
        imgUrl: require("../../../assets/images/wom5.jpeg"),
      },
      {
        imgUrl: require("../../../assets/images/wom2.jpeg"),
      },
    ],
  },
  // More users...
];

export default function Page() {
  const { user } = useUser();

  for (let i = 0; i < users.length; i++) {
    console.log("image", users[i].images[0].imgUrl);
  }

  return (
    <SafeAreaView>
      <ScrollView>
        {users.map((user) => (
          <View key={user.id} style={{ marginBottom: 20 }}>
            <Text>{user.name}</Text>
            {user.images.map((image, index) => (
              <Image
                key={index}
                source={image.imgUrl}
                style={{ width: 50, height: 50, marginRight: 10 }}
                alt="user image"
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
