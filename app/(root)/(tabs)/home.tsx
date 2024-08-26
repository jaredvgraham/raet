import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  Animated,
  PanResponder,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export const users = [
  {
    id: 1,
    name: "Emily Johnson",
    age: 28,
    location: "5",
    bio: "Love exploring the city, trying new restaurants, and reading mystery novels.",
    images: [
      {
        imgUrl: require("../../../assets/images/wom2.jpeg"),
      },
      {
        imgUrl: require("../../../assets/images/man2.jpeg"),
      },
    ],
  },
  {
    id: 2,
    name: "Sophia Martinez",
    age: 26,
    location: "10",
    bio: "Actress by day, fitness enthusiast by night. Let's go on an adventure!",
    images: [
      {
        imgUrl: require("../../../assets/images/wom3alt.jpeg"),
      },
      {
        imgUrl: require("../../../assets/images/man2.jpeg"),
      },
    ],
  },
  {
    id: 3,
    name: "Olivia Brown",
    age: 30,
    location: "4",
    bio: "Tech geek and coffee lover. Always up for a good conversation.",
    images: [
      {
        imgUrl: require("../../../assets/images/man2.jpeg"),
      },
      {
        imgUrl: require("../../../assets/images/wom5alt.jpeg"),
      },
    ],
  },
];

export default function SwipeableCardDeck() {
  const [profiles, setProfiles] = useState(users);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const rateRef = useRef<number | null>(null);

  const position = useRef(new Animated.ValueXY()).current;
  const nextCardOpacity = useRef(new Animated.Value(0)).current;
  const nextCardScale = useRef(new Animated.Value(0.9)).current;
  const touchStartTime = useRef(0);
  const swipeDetected = useRef(false);
  const gestureStartX = useRef(0);
  const gestureStartY = useRef(0);

  const currentProfileRef = useRef(profiles[currentProfileIndex]);

  useEffect(() => {
    currentProfileRef.current = profiles[currentProfileIndex];
  }, [profiles, currentProfileIndex]);

  const handleSwipeAction = async (direction) => {
    const currentProfile = currentProfileRef.current;

    if (!currentProfile) {
      return; // Exit early if no current profile
    }

    if (direction === "right") {
      console.log("Swiped right on: ", currentProfile.name);
      // Send 'like' action to backend
      await sendSwipeToBackend(currentProfile.id, "right");
    } else if (direction === "left") {
      console.log("Swiped left on: ", currentProfile.name);
      // Send 'dislike' action to backend
      await sendSwipeToBackend(currentProfile.id, "left");
    }

    if (rateRef.current !== null) {
      console.log(`Rated ${currentProfile.name} with: ${rateRef.current}`);
      // Handle the rating logic here

      rateRef.current = null; // Reset the ref after using it
    }

    // Now update the profile state
    setProfiles((prevProfiles) => {
      const nextProfiles = prevProfiles.filter(
        (profile) => profile.id !== currentProfile.id
      );

      if (nextProfiles.length === 0) {
        console.log("No more profiles to display");
        return [];
      }

      setCurrentProfileIndex(0); // Reset to the first profile in the new list
      setCurrentImageIndex(0);
      return nextProfiles;
    });

    // Reset animation values for the next card
    position.setValue({ x: 0, y: 0 });
    nextCardOpacity.setValue(0);
    nextCardScale.setValue(0.9);
  };

  const sendSwipeToBackend = async (userId, direction) => {
    // Replace this with the actual API call
    console.log(`Sending ${direction} swipe for user ${userId} to backend...`);
    // Simulate a network request with a timeout
  };

  const handleRateChange = (number: number) => {
    rateRef.current = number;
    console.log("Rate set via ref:", rateRef.current); // For debugging
  };

  const handleImageTap = () => {
    setCurrentImageIndex((prevIndex) => {
      const user = profiles[currentProfileIndex];
      const nextIndex = prevIndex + 1;
      return nextIndex < user.images.length ? nextIndex : 0;
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gestureState) => {
        touchStartTime.current = Date.now();
        gestureStartX.current = gestureState.x0;
        gestureStartY.current = gestureState.y0;
        swipeDetected.current = false;

        position.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (_, gestureState) => {
        const dx = Math.abs(gestureState.moveX - gestureStartX.current);
        const dy = Math.abs(gestureState.moveY - gestureStartY.current);
        const distance = dx + dy;

        if (distance > 10) {
          swipeDetected.current = true;
          position.setValue({ x: gestureState.dx, y: gestureState.dy });

          Animated.spring(nextCardOpacity, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          }).start();

          Animated.spring(nextCardScale, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const touchDuration = Date.now() - touchStartTime.current;

        if (swipeDetected.current) {
          if (gestureState.dx > 120) {
            handleSwipeAction("right");
          } else if (gestureState.dx < -120) {
            handleSwipeAction("left");
          } else {
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
            }).start();

            Animated.spring(nextCardOpacity, {
              toValue: 0,
              friction: 4,
              useNativeDriver: true,
            }).start();

            Animated.spring(nextCardScale, {
              toValue: 0.9,
              friction: 4,
              useNativeDriver: true,
            }).start();
          }
        } else if (touchDuration < 200 && !swipeDetected.current) {
          handleImageTap();
        }

        position.flattenOffset();
      },
    })
  ).current;

  if (profiles.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
        <Text>No more users to show.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
      <View
        className="relative justify-center items-center"
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_WIDTH * 1.2,
          marginVertical: SCREEN_HEIGHT / 2 - (SCREEN_WIDTH * 1.2) / 2, // Center the container vertically
        }}
      >
        {
          profiles
            .map((user, index) => {
              if (index < currentProfileIndex) {
                return null; // Don't render cards that have been swiped away
              }

              const isCurrentCard = index === currentProfileIndex;
              const isNextCard = index === currentProfileIndex + 1;

              return (
                <Animated.View
                  key={user.id}
                  {...(isCurrentCard ? panResponder.panHandlers : {})}
                  style={[
                    {
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      zIndex: -index,
                    },
                    isCurrentCard && position.getLayout(),
                    isNextCard && {
                      opacity: nextCardOpacity,
                      transform: [{ scale: nextCardScale }],
                    },
                  ]}
                  className="bg-white rounded-xl shadow-lg"
                >
                  <ImageBackground
                    source={user.images[currentImageIndex].imgUrl}
                    className="w-full h-full"
                    style={{
                      justifyContent: "flex-end",
                    }}
                  >
                    <LinearGradient
                      colors={["rgba(0,0,0,0.01)", "rgba(0,0,0,0.8)"]}
                      style={{
                        padding: 10,
                      }}
                    >
                      <View className="text-center ">
                        <Text className="text-2xl font-bold text-white text-center">
                          {user.name}, {user.age}
                        </Text>
                        <Text className="text-lg text-gray-300 text-center">
                          Distance: {user.location} Miles
                        </Text>
                      </View>
                    </LinearGradient>
                    <Image
                      source={require("../../../assets/images/like.png")}
                      className="w-10 h-10 absolute bottom-5 right-3"
                    />
                    <Image
                      source={require("../../../assets/images/dislike.png")}
                      className="w-10 h-10 absolute bottom-5 left-3"
                    />
                  </ImageBackground>
                  {/* Rating Buttons */}
                  <View
                    className="flex-row justify-between bg-black p-3 "
                    style={{
                      borderBottomLeftRadius: 20,
                      borderBottomRightRadius: 20,
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number, index) => (
                      <TouchableOpacity
                        className="bg-white p-2 min-w-[30px] rounded-lg "
                        key={index}
                        onPress={() => handleRateChange(number)}
                      >
                        <Text className="text-center text-gray-800">
                          {number}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </Animated.View>
              );
            })
            .reverse() /* Ensure the first card is rendered on top */
        }
      </View>
    </SafeAreaView>
  );
}
