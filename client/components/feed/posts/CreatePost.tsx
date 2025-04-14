// app/create-post.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";

const CreatePostScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const router = useRouter();

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
    if (!image || !caption.trim()) {
      Alert.alert("Missing info", "Please add an image and caption.");
      return;
    }

    // Normally you'd upload to your backend here
    console.log("Uploading post:", { image, caption });

    // Navigate back or refresh feed
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-5">
      <Text className="text-2xl font-bold mb-4">New Post</Text>

      <TouchableOpacity
        className="bg-gray-200 h-60 rounded-xl justify-center items-center mb-4"
        onPress={pickImage}
      >
        {image ? (
          <Image
            source={{ uri: image }}
            className="w-full h-full rounded-xl"
            resizeMode="cover"
          />
        ) : (
          <Icon name="camera" size={32} color="#6b7280" />
        )}
      </TouchableOpacity>

      <TextInput
        value={caption}
        onChangeText={setCaption}
        placeholder="Write a caption..."
        className="border border-gray-300 rounded-lg p-4 mb-6 text-base text-gray-700"
        multiline
      />

      <TouchableOpacity
        onPress={handlePost}
        className="bg-black rounded-full py-4"
      >
        <Text className="text-white text-center text-lg font-semibold">
          Post
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CreatePostScreen;
