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
      {
        imgUrl: require("../../../assets/images/wom5.jpeg"),
      },
      {
        imgUrl: require("../../../assets/images/wom5alt.jpeg"),
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
      {
        imgUrl: require("../../../assets/images/wom5.jpeg"),
      },
      {
        imgUrl: require("../../../assets/images/wom5alt.jpeg"),
      },
    ],
  },
];

export const users2 = [
  {
    id: 4,
    name: "Ava Wilson",
    age: 25,
    location: "3",
    bio: "Traveling the world, one country at a time. Looking for a travel buddy!",
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
    id: 5,
    name: "Isabella Moore",
    age: 27,
    location: "7",
    bio: "Dog lover, foodie, and fitness enthusiast. Let's go on a run!",
    images: [
      {
        imgUrl: require("../../../assets/images/man2.jpeg"),
      },
      {
        imgUrl: require("../../../assets/images/wom5alt.jpeg"),
      },
    ],
  },
  {
    id: 6,
    name: "Mia Taylor",
    age: 29,
    location: "2",
    bio: "Yoga instructor and nature lover. Let's go on a hike!",
    images: [
      {
        imgUrl: require("../../../assets/images/wom2.jpeg"),
      },
      {
        imgUrl: require("../../../assets/images/man2.jpeg"),
      },
    ],
  },
];

export default function SwipeableCardDeck() {
  const [profiles, setProfiles] = useState(users);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const rateRef = useRef<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  const position = useRef(new Animated.ValueXY()).current;
  const nextCardOpacity = useRef(new Animated.Value(0)).current;

  const nextCardScale = useRef(new Animated.Value(0.9)).current;
  const touchStartTime = useRef(0);
  const swipeDetected = useRef(false);
  const gestureStartX = useRef(0);
  const gestureStartY = useRef(0);

  const currentProfileRef = useRef(profiles[currentProfileIndex]);
  const nextProfileRef = useRef(profiles[currentProfileIndex + 1]);

  useEffect(() => {
    currentProfileRef.current = profiles[currentProfileIndex];
    nextProfileRef.current = profiles[currentProfileIndex + 1];
    console.log(
      "profiles",
      profiles.map((profile) => profile.name)
    );
    if (profiles.length === 1) {
      fetchMoreProfiles();
    }

    setIsReady(false); // Reset readiness state
    setCurrentImageIndex(0); // Reset image index when profile changes

    setTimeout(() => {
      setIsReady(true); // Ensure RenderImageIndicators uses the updated profile
    }, 20);
  }, [profiles, currentProfileIndex]);

  const fetchMoreProfiles = () => {
    console.log("Fetching more profiles...");

    // Simulate a network request with a timeout
    setTimeout(() => {
      setProfiles((prevProfiles) => [...prevProfiles, ...users2]);
    }, 1000);
  };

  const handleSwipeAction = async (direction) => {
    console.log("Handling swipe starting...");

    const currentProfile = currentProfileRef.current;

    if (!currentProfile) {
      return; // Exit early if no current profile
    }

    if (direction === "right") {
      // Send 'like' action to backend
      await sendSwipeToBackend(currentProfile.id, "right");
    } else if (direction === "left") {
      // Send 'dislike' action to backend
      await sendSwipeToBackend(currentProfile.id, "left");
    }
    console.log("profiles", profiles.length);

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
    nextCardScale.setValue(1);
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

  const handleImageTap = (gestureState) => {
    const user = currentProfileRef.current;
    const screenWidthHalf = SCREEN_WIDTH / 2;
    console.log("getureState.x0", gestureState.x0);
    console.log("Screen width half:", screenWidthHalf);
    console.log(typeof gestureState.x0);
    console.log(typeof screenWidthHalf);

    console.log(gestureState.x0 > screenWidthHalf);

    if (gestureState.x0 > screenWidthHalf) {
      console.log(user.images.length, "is len");

      setCurrentImageIndex((prevIndex) =>
        prevIndex === user.images.length - 1 ? prevIndex : prevIndex + 1
      );
    } else {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? prevIndex : prevIndex - 1
      );
    }
  };

  const triggerSwipe = (direction) => {
    console.log("Triggering swipe:", direction);

    const finalX =
      direction === "right" ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;

    Animated.spring(position, {
      speed: 5,
      bounciness: 10,
      toValue: { x: finalX, y: 0 },
      useNativeDriver: false,
    }).start(() => {
      handleSwipeAction(direction);
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
          if (gestureState.dx > 60) {
            Animated.spring(position, {
              speed: 50,
              bounciness: 10,

              toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy },

              useNativeDriver: false,
            }).start(() => {
              handleSwipeAction("right");
            });
          } else if (gestureState.dx < -60) {
            Animated.spring(position, {
              speed: 5,
              bounciness: 10,

              toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },

              useNativeDriver: false,
            }).start(() => {
              handleSwipeAction("left");
            });
          } else {
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
            }).start();
          }
        } else if (touchDuration < 200 && !swipeDetected.current) {
          handleImageTap(gestureState);
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

  const RenderImageIndicators = () => {
    const user = currentProfileRef.current;
    if (!user.images || !isReady) {
      return null;
    }

    return (
      <View
        style={{
          position: "absolute",
          top: 10,
          left: 0,
          right: 0,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {user.images.map((_, index) => (
          <View
            key={index}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: index === currentImageIndex ? "white" : "gray",
              marginHorizontal: 3,
            }}
          />
        ))}
      </View>
    );
  };
  //

  return (
    <SafeAreaView className="flex-1   items-center ">
      <View
        className="relative justify-center   items-center"
        style={{
          width: SCREEN_WIDTH - 1,
          height: SCREEN_HEIGHT * 0.65,
          marginVertical: "auto", // Center the container vertically
        }}
      >
        {
          profiles
            .map((user, index) => {
              if (index < currentProfileIndex) {
                return null; // Don't render cards that have been swiped away
              }

              const isCurrentCard = index === currentProfileIndex;

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
                  ]}
                  className=" rounded-2xl shadow-lg  "
                >
                  <ImageBackground
                    source={
                      currentProfileRef.current.id === user.id
                        ? currentProfileRef.current.images[currentImageIndex]
                            .imgUrl
                        : user.images[0].imgUrl
                    }
                    className="w-full h-full overflow-hidden rounded-t-2xl bg-black"
                    style={{
                      justifyContent: "flex-end",
                    }}
                  >
                    {isCurrentCard && <RenderImageIndicators />}
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
                    <TouchableOpacity onPress={() => triggerSwipe("right")}>
                      <Image
                        source={require("../../../assets/images/like.png")}
                        className="w-10 h-10 absolute bottom-5 right-3"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => triggerSwipe("left")}>
                      <Image
                        source={require("../../../assets/images/dislike.png")}
                        className="w-10 h-10 absolute bottom-5 left-3"
                      />
                    </TouchableOpacity>
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
