//
//   THIS FILE IS INSANITY
//

import React, { useState, useRef, useEffect, useCallback } from "react";
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
  PanResponderGestureState,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "@/components/header";
import { getUserLocation } from "@/utils/contants";
import { useAuthFetch } from "@/hooks/Privatefetch";
import { Profile } from "@/types";
import Notification from "@/components/Notification";
import { useFocusEffect } from "expo-router";
import { set } from "firebase/database";

export const users = [
  {
    _id: "64e4bc66f0c1b462bc5df8b7",
    name: "Emily Johnson",
    age: 28,
    clerkId: "ckr1",
    distance: 5,
    bio: "Love exploring the city, trying new restaurants, and reading mystery novels.",
    interests: ["Reading", "Traveling", "Cooking"],
    images: [
      require("../../../assets/images/wom2.jpeg"),
      require("../../../assets/images/man2.jpeg"),
      require("../../../assets/images/wom5.jpeg"),
      require("../../../assets/images/wom5alt.jpeg"),
    ],
  },
  {
    _id: "64e4bc66f0c1b462bc5df8b8",
    name: "Sophia Martinez",
    age: 26,
    clerkId: "ckr2",
    distance: 10,
    bio: "Actress by day, fitness enthusiast by night. Let's go on an adventure!",
    interests: ["Acting", "Fitness", "Adventures"],
    images: [
      require("../../../assets/images/wom3alt.jpeg"),
      require("../../../assets/images/man2.jpeg"),
    ],
  },
  {
    _id: "64e4bc66f0c1b462bc5df8b9",
    name: "Olivia Brown",
    age: 30,
    clerkId: "ckr3",
    distance: 4,
    bio: "Tech geek and coffee lover. Always up for a good conversation.",
    interests: ["Technology", "Coffee", "Conversation"],
    images: [
      require("../../../assets/images/man2.jpeg"),
      require("../../../assets/images/wom5alt.jpeg"),
    ],
  },
];

export const users2 = [
  {
    _id: "64e4bc66f0c1b462bc5df8ba",
    name: "Ava Wilson",
    age: 25,
    clerkId: "ckr4",
    distance: 3,
    bio: "Traveling the world, one country at a time. Looking for a travel buddy!",
    interests: ["Travel", "Photography", "Blogging"],
    images: [
      require("../../../assets/images/wom3alt.jpeg"),
      require("../../../assets/images/man2.jpeg"),
    ],
  },
  {
    _id: "64e4bc66f0c1b462bc5df8bb",
    name: "Isabella Moore",
    age: 27,
    clerkId: "ckr5",
    distance: 7,
    bio: "Dog lover, foodie, and fitness enthusiast. Let's go on a run!",
    interests: ["Dogs", "Food", "Fitness"],
    images: [
      require("../../../assets/images/man2.jpeg"),
      require("../../../assets/images/wom5alt.jpeg"),
    ],
  },
  {
    _id: "64e4bc66f0c1b462bc5df8bc",
    name: "Mia Taylor",
    age: 29,
    clerkId: "ckr6",
    distance: 2,
    bio: "Yoga instructor and nature lover. Let's go on a hike!",
    interests: ["Yoga", "Nature", "Hiking"],
    images: [
      require("../../../assets/images/wom2.jpeg"),
      require("../../../assets/images/man2.jpeg"),
    ],
  },
];

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function SwipeableCardDeck() {
  const authFetch = useAuthFetch();
  const renderedProfiles = new Set();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [rate, setRate] = useState<number | null>(null);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [swipingDirection, setSwipingDirection] = useState("");
  const [noProfilesLeft, setNoProfilesLeft] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [isReady, setIsReady] = useState(false);

  const position = useRef(new Animated.ValueXY()).current;
  const nextCardOpacity = useRef(new Animated.Value(0)).current;

  const nextCardScale = useRef(new Animated.Value(0.9)).current;
  const touchStartTime = useRef(0);
  const swipeDetected = useRef(false);
  const gestureStartX = useRef(0);
  const gestureStartY = useRef(0);

  const currentProfileRef = useRef(
    profiles ? profiles[currentProfileIndex] : null
  );
  const nextProfileRef = useRef(
    profiles ? profiles[currentProfileIndex + 1] : null
  );
  const rateRef = useRef<number | null>(null);

  const [showNotification, setShowNotification] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    fetchMoreProfiles();
  }, []);

  const handleProfileChange = () => {
    if (!profiles) return;

    currentProfileRef.current = profiles[currentProfileIndex];
    nextProfileRef.current = profiles[currentProfileIndex + 1];
    console.log(
      "profiles",
      profiles.map((profile: Profile) => profile.name)
    );
    if (profiles.length <= 1 && !noProfilesLeft) {
      fetchMoreProfiles();
    }
  };

  useEffect(() => {
    handleProfileChange();

    setIsReady(false); // Reset readiness state
    setCurrentImageIndex(0); // Reset image index when profile changes

    setTimeout(() => {
      setIsReady(true); // Ensure RenderImageIndicators uses the updated profile
    }, 1);
  }, [profiles, currentProfileIndex]);

  const fetchMoreProfiles = async () => {
    console.log("Fetching more profiles...");
    if (profiles.length > 3) return;

    try {
      const res = await authFetch("/api/feed", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res?.json();
      console.log("data", data.feed);
      if (data.feed.length === 0) {
        setNoProfilesLeft(true);
        return;
      }

      if (profiles) {
        setProfiles((prevProfiles) => [...prevProfiles, ...data.feed]);
      } else {
        setProfiles(data.feed);
      }
      setNoProfilesLeft(false);
    } catch (error) {
      console.log("error fetching profiles", error);
      setNoProfilesLeft(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log("Hello, I am focused!");
      fetchMoreProfiles();
      handleProfileChange();
      setCurrentImageIndex(0);

      return () => {
        console.log("This route is now unfocused.");
      };
    }, [profiles, currentProfileIndex])
  );

  const handleSwipeAction = async (direction: string) => {
    if (!currentProfileRef.current) {
      return;
    }
    console.log("Handling swipe starting...");
    setSwipingDirection(""); // Reset the swiping direction

    const currentProfile = currentProfileRef.current;

    if (!currentProfile) {
      return; // Exit early if no current profile
    }

    if (direction === "right") {
      // Send 'like' action to backend
      await sendSwipeToBackend(
        currentProfile.clerkId,
        "right",
        rateRef.current
      );
    } else if (direction === "left") {
      // Send 'dislike' action to backend
      await sendSwipeToBackend(currentProfile.clerkId, "left", rateRef.current);
    }
    console.log("profiles", profiles.length);

    if (rateRef.current !== null) {
      console.log(`Rated ${currentProfile.name} with: ${rateRef.current}`);
      // Handle the rating logic here

      rateRef.current = null; // Reset the ref after using it
      setRate(null); // Reset the state after using it
    }

    setProfiles((prevProfiles) => {
      const nextProfiles = prevProfiles.filter(
        (profile) => profile._id !== currentProfile._id
      );

      setCurrentProfileIndex(0); // Reset to the first profile in the new list
      setCurrentImageIndex(0);
      return nextProfiles;
    });

    // Reset animation values for the next card
    position.setValue({ x: 0, y: 0 });
    nextCardOpacity.setValue(0);
    nextCardScale.setValue(1);
  };

  const sendSwipeToBackend = async (
    userId: string,
    direction: string,
    rate: number | null
  ) => {
    console.log(`Sending ${direction} swipe for user ${userId} to backend...`);

    try {
      const res = await authFetch("/api/feed/swipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          swipedId: userId,
          direction,
          rate,
        }),
      });
      const data = await res?.json();
      console.log("res", data);

      if (data.message && data.message.includes("Match")) {
        // Display a toast notification for a match
        setShowNotification({
          visible: true,
          message: `${data.message} 🎉`,
          type: "success",
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleRateChange = (number: number) => {
    rateRef.current = number;
    setRate(number);
    console.log("Rate set via ref:", rateRef.current); // For debugging
  };

  const handleImageTap = (gestureState: PanResponderGestureState) => {
    const user = currentProfileRef.current;
    if (!user) return;
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

  const triggerSwipe = (direction: string) => {
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
        setSwipingDirection("");
      },
      onPanResponderMove: (_, gestureState) => {
        const dx = Math.abs(gestureState.moveX - gestureStartX.current);
        const dy = Math.abs(gestureState.moveY - gestureStartY.current);
        const distance = dx + dy;

        if (distance > 10) {
          console.log(distance, "is distance");
          if (gestureState.dx > 0) {
            setSwipingDirection("right");
          } else if (gestureState.dx < 0) {
            setSwipingDirection("left");
          } else {
            setSwipingDirection("");
          }

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
          if (gestureState.dx < 60 && gestureState.dx > -60) {
            setSwipingDirection("");
          }
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
            }).start(() => {
              setSwipingDirection("");
            });
          }
        } else if (touchDuration < 200 && !swipeDetected.current) {
          handleImageTap(gestureState);
        }

        position.flattenOffset();
      },
    })
  ).current;

  if (noProfilesLeft) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
        <Header />
        {showNotification.visible && (
          <Notification
            {...showNotification}
            onHide={() =>
              setShowNotification({
                visible: false,
                message: "",
                type: "success",
              })
            }
          />
        )}
        <Text>No more users to show.</Text>
      </SafeAreaView>
    );
  }

  const RenderImageIndicators = () => {
    if (!currentProfileRef.current) return null;
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
    <>
      <SafeAreaView className="flex-1 bg-white items-center ">
        <Header />
        {showNotification.visible && (
          <Notification
            {...showNotification}
            onHide={() =>
              setShowNotification({
                visible: false,
                message: "",
                type: "success",
              })
            }
          />
        )}
        <View
          className="relative  rounded-lg shadow-2xl  items-center"
          style={{
            width: SCREEN_WIDTH - 0.4,
            height: SCREEN_HEIGHT * 0.7,
            // Center the container vertically
          }}
        >
          {profiles.map((user, index) => {
            if (renderedProfiles.has(user._id)) {
              return null;
            }
            renderedProfiles.add(user._id);
            if (index < currentProfileIndex) {
              return null; // Don't render cards that have been swiped away
            }

            const isCurrentCard = index === currentProfileIndex;

            return (
              <Animated.View
                key={user._id}
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
                className="   "
              >
                {isCurrentCard && swipingDirection === "right" && (
                  <Text
                    className="absolute top-10 left-10 text-2xl z-10 text-white bg-green-400 p-1 font-bold"
                    style={{
                      transform: [{ rotate: "20deg" }],
                    }}
                  >
                    YES
                  </Text>
                )}
                {isCurrentCard && swipingDirection === "left" && (
                  <Text
                    className="absolute top-10 right-10 text-2xl z-10 text-white bg-red-400 p-1 font-bold"
                    style={{
                      transform: [{ rotate: "-20deg" }],
                    }}
                  >
                    NOPE
                  </Text>
                )}
                {currentProfileRef.current && (
                  <ImageBackground
                    source={{
                      uri:
                        currentProfileRef.current._id === user._id
                          ? currentProfileRef.current.images[currentImageIndex]
                          : user.images[0],
                    }}
                    className="w-full h-full overflow-hidden rounded-t-2xl bg-white"
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
                          Distance: {user.distance} Miles
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
                )}

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
                      className={`${
                        rate === number ? "bg-teal-300" : "bg-white"
                      }  p-2 min-w-[30px] rounded-lg `}
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
          })}
        </View>
      </SafeAreaView>
    </>
  );
}
