// app/create-post.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useAuthFetch } from "@/hooks/Privatefetch";
import PostCard from "./PostCard";
import { useFeedPage } from "@/hooks/useFeedPage";

type CreatePostScreenProps = {
  setCreatingPost: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreatePostScreen = ({ setCreatingPost }: CreatePostScreenProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const router = useRouter();
  const authFetch = useAuthFetch();
  const [sharing, setSharing] = useState(false);
  const { setCurrentPage } = useFeedPage();

  const pickImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Denied", "Camera access is required.");
      return;
    }

    Alert.alert("Add Photo", "Choose an option", [
      {
        text: "Take Photo",
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 5],
            quality: 0.8,
          });
          if (!result.canceled) {
            setImage(result.assets[0].uri);
          }
        },
      },
      {
        text: "Choose from Gallery",
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 5],
            quality: 0.8,
          });
          if (!result.canceled) {
            setImage(result.assets[0].uri);
          }
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const handlePost = async () => {
    try {
      if (sharing) return;
      setSharing(true);
      if (!image || !caption.trim()) {
        Alert.alert("Missing info", "Please add an image and caption.");
        return;
      }
      const formData = new FormData();
      formData.append("images", {
        uri: image,
        type: "image/jpeg",
        name: "post",
      } as any);
      formData.append("caption", caption);

      const response = await authFetch("/api/post", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = await response.json();
      console.log("data", data);

      setCreatingPost(false);
    } catch (error) {
      console.log("error", error);
      Alert.alert("Error", (error as any).message || "Something went wrong");
    } finally {
      setSharing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="">
        <View className="px-6 pt-6 relative">
          {/* Close Button */}
          <TouchableOpacity className="" onPress={() => setCreatingPost(false)}>
            <Icon name="close" size={24} color="red" />
          </TouchableOpacity>
          {/* Header */}
          <Text className="text-4xl font-bold text-black mb-6 text-center">
            New Post
          </Text>

          {/* Image Upload Section */}
          <TouchableOpacity
            onPress={pickImage}
            activeOpacity={0.8}
            className="h-80 bg-gray-100 rounded-3xl overflow-hidden relative justify-center items-center mb-6 shadow-md"
          >
            {image ? (
              <Image
                source={{ uri: image }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <>
                <Icon name="camera" size={34} color="#a3a3a3" />
                <Text className="text-gray-400 mt-2 text-sm font-medium">
                  Tap to add photo
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Caption Input */}
          <View className="mb-8">
            <Text className="text-gray-600 text-base mb-2 font-semibold">
              Caption
            </Text>
            <TextInput
              value={caption}
              onChangeText={setCaption}
              placeholder="What's on your mind?"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={5}
              className="text-base text-gray-800 bg-gray-50 border border-gray-300 rounded-2xl p-4"
            />
          </View>

          {/* Post Button */}
          {!sharing ? (
            <TouchableOpacity
              onPress={handlePost}
              className="bg-black rounded-3xl py-4 mb-6"
            >
              <Text className="text-white text-center text-lg font-semibold">
                Share
              </Text>
            </TouchableOpacity>
          ) : (
            <View className="bg-gray-300 rounded-3xl py-4 mb-6">
              <Text className="text-gray-600 text-center text-lg font-semibold">
                Sharing...
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreatePostScreen;
