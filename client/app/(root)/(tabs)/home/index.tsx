// import React, { useEffect, useState } from "react";
// import {
//   Dimensions,
//   SafeAreaView,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { useSwipeFeed } from "@/hooks/useSwipeFeed";
// import SwipeableCard from "@/components/feed/SwipeableCard";
// import { Profile } from "@/types";
// import RatingButtons from "@/components/feed/RateButtons";
// import { Image } from "expo-image";

// export default function SwipeableDeck() {
//   const { profiles, loading, noProfilesLeft, fetchProfiles, handleSwipe } =
//     useSwipeFeed();

//   const [rate, setRate] = useState<number | null>(null);
//   const [imageIndex, setImageIndex] = useState(0);
//   const [current, setCurrent] = useState<Profile | null>(null);
//   const [next, setNext] = useState<Profile | null>(null);
//   const [cardKey, setCardKey] = useState(0); // 👈 new key to force remount

//   useEffect(() => {
//     fetchProfiles();
//   }, []);

//   useEffect(() => {
//     console.log(
//       "Profiles updated:",
//       profiles.map((p) => p.name)
//     );

//     if (profiles.length > 0) {
//       setCurrent(profiles[0]);
//       setNext(profiles[1] || null);
//       setCardKey((prev) => prev + 1); // 👈 update key to force remount
//     } else {
//       setCurrent(null);
//       setNext(null);
//     }
//   }, [profiles]);

//   if (loading) {
//     return (
//       <SafeAreaView className="flex-1 justify-center items-center bg-white">
//         <Text className="text-xl text-gray-500">Loading...</Text>
//       </SafeAreaView>
//     );
//   }

//   if (noProfilesLeft || !current) {
//     return (
//       <SafeAreaView className="flex-1 justify-center items-center bg-white">
//         <Text className="text-xl text-gray-500">No more profiles</Text>
//       </SafeAreaView>
//     );
//   }

//   const handleTap = (tapX: number) => {
//     const screenWidth = Dimensions.get("window").width;
//     if (tapX > screenWidth / 2) {
//       setImageIndex((prev) => Math.min(prev + 1, current.images.length - 1));
//     } else {
//       setImageIndex((prev) => Math.max(prev - 1, 0));
//     }
//   };

//   const onSwipe = (dir: "left" | "right") => {
//     handleSwipe(current, dir, rate ?? undefined);
//     setRate(null);
//     setImageIndex(0); // reset for next profile
//   };

//   return (
//     <SafeAreaView className="flex-1 items-center justify-center bg-white">
//       {next && (
//         <SwipeableCard
//           key={next._id}
//           user={next}
//           rate={null}
//           onRateChange={() => {}}
//           onSwipe={() => {}}
//           currentImageIndex={0}
//           isBackCard
//         />
//       )}
//       <SwipeableCard
//         key={cardKey} // 👈 use the new key to force remount
//         user={current}
//         rate={rate}
//         onRateChange={setRate}
//         onSwipe={onSwipe}
//         currentImageIndex={imageIndex}
//         onImageTap={handleTap}
//       />

//       {/* Buttons */}
//       <View
//         style={{
//           position: "absolute",
//           bottom: 120,
//           left: 0,
//           right: 0,
//           zIndex: 20,
//           flexDirection: "row",
//           justifyContent: "space-between",
//           paddingHorizontal: 10,
//         }}
//       >
//         <TouchableOpacity onPress={() => onSwipe("left")}>
//           <Image
//             source={require("../../../assets/images/dislike.png")}
//             style={{ width: 60, height: 60 }}
//           />
//         </TouchableOpacity>

//         <TouchableOpacity onPress={() => onSwipe("right")}>
//           <Image
//             source={require("../../../assets/images/like.png")}
//             style={{ width: 60, height: 60 }}
//           />
//         </TouchableOpacity>
//       </View>

//       {/* Rating */}
//       <View className="absolute bottom-10 w-full items-center z-20 ">
//         <RatingButtons rate={rate} onRateChange={setRate} isCurrentCard />
//       </View>
//     </SafeAreaView>
//   );
// }
import { View, Text } from "react-native";
import React from "react";
import FuturisticDeck from "@/components/feed/ScrollableDeck";
import { useFeedPage } from "@/hooks/useFeedPage";
import CreatePostScreen from "@/components/feed/posts/CreatePost";
import PostFeed from "@/components/feed/posts/PostFeed";

const Home = () => {
  const { currentPage } = useFeedPage();
  return (
    <>
      <FuturisticDeck />
    </>
  );
};

export default Home;
