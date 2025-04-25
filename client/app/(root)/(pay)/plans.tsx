import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
  Platform,
} from "react-native";
import * as IAP from "react-native-iap";

const { width } = Dimensions.get("window");

const items = Platform.select({
  ios: ["basic_monthly", "standard_monthly", "premium_monthly"],
  android: [""],
});

const plans = [
  {
    title: "Basic Monthly",
    price: "$4.99 / month",
    features: ["See who likes you", "Unlimited swipes"],
  },
  {
    title: "Standard Monthly",
    price: "$9.99 / month",
    features: [
      "See who likes you",
      "Unlimited swipes",
      "See your rating",
      "Priority boost",
      "Profile insights",
    ],
  },
  {
    title: "Premium Monthly",
    price: "$14.99 / month",
    features: [
      "See who likes you",
      "Unlimited swipes",
      "See your rating",
      "Priority boost",

      "Profile insights",
      "Be shown more",
      "Ad-free experience",
      "Explore outside your rating",
      "1 rate reset per 6 months",
    ],
  },
];

export default function SubscriptionPreview() {
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPlan, setCurrentPlan] = useState("Basic Monthly");
  const [purchased, setPurchased] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    IAP.initConnection()
      .then(() => {
        console.log("IAP connection initialized");
        IAP.getSubscriptions(items as any)
          .then((subscriptions) => {
            console.log("Subscriptions:", subscriptions);
          })
          .catch((error) => {
            console.error("Error fetching subscriptions:", error);
          });
      })
      .catch((error) => {
        console.error("Error initializing IAP connection:", error);
      });
  }, []);

  const handleNext = () => {
    if (activeIndex < plans.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
      setActiveIndex((prev) => prev + 1);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      {/* back button */}
      <TouchableOpacity className="ml-5" onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color="black" />
      </TouchableOpacity>

      <View className="flex-row justify-between items-center px-6 ">
        {plans.map((plan, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              flatListRef.current?.scrollToIndex({ index });
              setActiveIndex(index);
              setCurrentPlan(plan.title);
            }}
            className={`flex-1 items-center ${
              activeIndex === index
                ? "border-b-2 border-teal-500"
                : "border-b-2 border-transparent"
            }`}
          >
            <Text className="font-bold mt-6 mb-4 text-center">
              {plan.title.split(" ")[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        ref={flatListRef}
        data={plans}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.title}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(newIndex);
        }}
        renderItem={({ item }) => (
          <View style={{ width }} className="px-6 py-8 justify-center">
            <View className="bg-black rounded-2xl p-6 shadow-md">
              <Text className="text-white text-2xl font-bold text-center mb-1">
                {item.title}
              </Text>
              <Text className="text-teal-400 text-center font-semibold mb-6">
                {item.price}
              </Text>

              {/* Features */}
              {plans[2].features.map((feature, idx) => (
                <View
                  key={idx}
                  className="flex-row items-center space-x-2 mb-2"
                >
                  <Feather
                    name="check-circle"
                    size={18}
                    color={`${
                      item.features.includes(feature) ? "#14b8a6" : "gray"
                    }`}
                  />
                  <Text className="text-white text-base">{feature}</Text>
                </View>
              ))}

              {/* Continue Button */}
              <TouchableOpacity className="mt-2 bg-teal-500 py-3 rounded-full">
                <Text className="text-white font-bold text-center text-lg">
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View className="px-6 pb-6">
        <Text className="text-xs text-gray-500 text-center">
          Subscription automatically renews unless canceled at least 24 hours
          before the end of the current period. You can manage it in App Store
          settings.
        </Text>
      </View>
    </SafeAreaView>
  );
}
