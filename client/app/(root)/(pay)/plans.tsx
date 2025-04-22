import { useAuthFetch } from "@/hooks/Privatefetch";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as RNIap from "react-native-iap";

// Your product IDs as listed in App Store Connect / Google Play Console
const productIds = ["basic_monthly", "standard_monthly", "premium_monthly"];

type Product = RNIap.Product;

export default function PurchaseScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const authFetch = useAuthFetch();

  useEffect(() => {
    const connectAndGetProducts = async () => {
      try {
        const connected = await RNIap.initConnection();
        if (connected) {
          const fetchedProducts = await RNIap.getProducts({ skus: productIds });
          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.error("IAP connection error", error);
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
          ? Array.isArray(purchase)
            ? purchase[0]?.transactionReceipt
            : purchase?.transactionReceipt
          : (purchase as any).purchaseToken;

      const res = await authFetch(`/iap/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: Platform.OS,
          receipt,
          productId,
        }),
      });

      const result = await res.json();
      if (result.success) {
        Alert.alert("✅ Success", "Purchase verified and features unlocked!");
      } else {
        Alert.alert("❌ Failed", "Could not verify purchase.");
      }
    } catch (error) {
      console.error("Purchase error", error);
      Alert.alert("Error", "Something went wrong with the purchase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 px-4 py-6 bg-white">
      <Text className="text-2xl font-bold mb-4">Upgrade Your Experience</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.productId}
        renderItem={({ item }) => (
          <View className="bg-gray-100 p-4 mb-4 rounded-lg">
            <Text className="text-lg font-semibold">{item.title}</Text>
            <Text className="text-sm text-gray-600 mt-1">
              {item.description}
            </Text>
            <Text className="text-md font-bold mt-2">
              {item.localizedPrice}
            </Text>
            <TouchableOpacity
              disabled={loading}
              onPress={() => handlePurchase(item.productId)}
              className="mt-3 bg-blue-500 px-4 py-2 rounded-full"
            >
              <Text className="text-white text-center">
                {loading ? "Processing..." : "Subscribe"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
