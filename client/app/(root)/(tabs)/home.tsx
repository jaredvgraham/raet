//
//   THIS FILE IS INSANITY
//
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Animated,
  PanResponder,
  Dimensions,
  PanResponderGestureState,
  TouchableOpacity,
} from "react-native";
import Header from "@/components/header";
import { useAuthFetch } from "@/hooks/Privatefetch";
import { Profile } from "@/types";
import Notification from "@/components/Notification";
import { useFocusEffect } from "expo-router";
import SwipeableCard from "@/components/feed/SwipeableCard";
import UserDetailScreen from "@/components/feed/CloserLook";
import { set } from "firebase/database";
import { getUserLocation } from "@/utils/contants";
import Links from "@/components/feed/Links";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function SwipeableCardDeck() {
  const authFetch = useAuthFetch();
  const renderedProfiles = new Set();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [Loading, setLoading] = useState(true);
  const [moreDetails, setMoreDetails] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [rate, setRate] = useState<number | null>(null);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [swipingDirection, setSwipingDirection] = useState("");
  const [noProfilesLeft, setNoProfilesLeft] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [showNotification, setShowNotification] = useState({
    visible: false,
    message: "",
    type: "success",
  });
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

      if (profiles.length > 0) {
        setProfiles((prevProfiles) => [...prevProfiles, ...data.feed]);
      } else {
        setProfiles(data.feed);
      }
      setNoProfilesLeft(false);
    } catch (error) {
      console.log("error fetching profiles", error);
      setNoProfilesLeft(true);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log("Hello, I am focused!");
      setLoading(true);
      fetchMoreProfiles();

      return () => {
        console.log("This route is now unfocused.");
      };
    }, [])
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

  const handleDetailsClick = (profile: Profile) => {
    setSelectedProfile(profile);
    setMoreDetails(true);
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
        <View>
          <Text>hey</Text>
        </View>
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

  if (Loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-gray-500">Loading ...</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      {moreDetails && selectedProfile ? (
        <UserDetailScreen
          profile={selectedProfile}
          onClose={setMoreDetails}
          onSwipeRight={() => {
            triggerSwipe("right");
            setMoreDetails(false);
          }}
          onSwipeLeft={() => {
            triggerSwipe("left");
            setMoreDetails(false);
          }}
        />
      ) : (
        <SafeAreaView className="flex-1 bg-white items-center ">
          <Header />
          <Links />
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
              height: SCREEN_HEIGHT * 0.65,
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
                <>
                  <SwipeableCard
                    key={user._id}
                    user={user}
                    index={index}
                    isCurrentCard={isCurrentCard}
                    swipingDirection={swipingDirection}
                    position={position}
                    panHandlers={isCurrentCard ? panResponder.panHandlers : {}}
                    currentImageIndex={currentImageIndex}
                    onSwipeRight={() => triggerSwipe("right")}
                    onSwipeLeft={() => triggerSwipe("left")}
                    onRateChange={handleRateChange}
                    rate={rate}
                    RenderImageIndicators={RenderImageIndicators}
                    onPressDetails={() => handleDetailsClick(user)}
                  />
                </>
              );
            })}
          </View>
        </SafeAreaView>
      )}
    </>
  );
}
