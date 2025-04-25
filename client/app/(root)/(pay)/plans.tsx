import { useAuthFetch } from "@/hooks/Privatefetch";
import { formatError } from "@/utils";
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
  Alert,
} from "react-native";
import * as IAP from "react-native-iap";
import * as RNIap from "react-native-iap";

const productIds = ["basic_monthly", "standard_monthly", "premium_monthly"];
type Product = RNIap.Product;
const { width } = Dimensions.get("window");

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPlan, setCurrentPlan] = useState("Basic Monthly");
  const [purchased, setPurchased] = useState(false);
  const authFetch = useAuthFetch();

  const router = useRouter();

  useEffect(() => {
    const connectAndGetProducts = async () => {
      try {
        console.log("Connecting to IAP...");

        const connected = await RNIap.initConnection();
        if (connected) {
          console.log("IAP connected");
          const fetchedProducts = await RNIap.getProducts({ skus: productIds });
          console.log("Fetched products", fetchedProducts);
          if (fetchedProducts.length === 0) {
            Alert.alert(
              "Length of products is 0",
              "Please check your product IDs and try again."
            );
            return;
          }
          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.error("IAP connection error", error);
        Alert.alert(
          formatError(error),
          "Something went wrong while connecting to the store."
        );
      }
    };

    connectAndGetProducts();

    return () => {
      RNIap.endConnection();
    };
  }, []);

  const handlePurchase = async (productId: string) => {
    try {
      setLoading(true);
      const purchase = await RNIap.requestPurchase({ sku: productId });

      const receipt =
        Platform.OS === "ios"
          ? purchase && !Array.isArray(purchase) && purchase.transactionReceipt
          : purchase &&
            !Array.isArray(purchase) &&
            (purchase as any).purchaseToken;

      if (!receipt) {
        throw new Error("Invalid purchase receipt");
      }

      const res = await authFetch("/api/iap/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: Platform.OS,
          receipt,
          productId,
        }),
      });

      const result = await res.json();
      console.log("Purchase verification result", result);
      console.log("Purchase verification result.data", result.data);
      if (!result.success) {
        throw new Error(result.message);
      }
      if (result.success) {
        Alert.alert(
          "Purchase Successful",
          `You have successfully purchased the ${currentPlan} plan.`
        );
        router.push("/(root)/home");
      }
    } catch (error) {
      console.error("Purchase error", error);
      Alert.alert(
        formatError(error),
        "Something went wrong with the purchase."
      );
    } finally {
      setLoading(false);
    }
  };

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
              <TouchableOpacity
                className="mt-2 bg-teal-500 py-3 rounded-full"
                onPress={() => {
                  handlePurchase(productIds[activeIndex]);
                  setPurchased(true);
                }}
                disabled={loading}
              >
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
