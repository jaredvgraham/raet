import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useAuthFetch } from "@/hooks/Privatefetch";
import { useFeedPage } from "@/hooks/useFeedPage";

type CreatePostScreenProps = {
  setCreatingPost: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreatePostScreen = ({ setCreatingPost }: CreatePostScreenProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [sharing, setSharing] = useState(false);

  const router = useRouter();
  const authFetch = useAuthFetch();
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

      if (!image) {
        Alert.alert("Missing info", "Please add an image and caption.");
        return;
      }

      if (!caption.trim()) {
        setCaption("");
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
      console.log("Posted data:", data);

      setCreatingPost(false);
    } catch (error) {
      console.log("Error posting:", error);
      Alert.alert("Error", (error as any).message || "Something went wrong");
    } finally {
      setSharing(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-1 justify-between px-4 pb-6">
            {/* Top Section */}
            <View>
              <TouchableOpacity
                onPress={() => setCreatingPost(false)}
                className="self-end mb-4"
              >
                <Icon name="close" size={24} color="red" />
              </TouchableOpacity>

              <Text className="text-3xl font-bold text-center mb-6">
                Create Post
              </Text>

              {/* Image Picker */}
              <TouchableOpacity
                onPress={pickImage}
                activeOpacity={0.8}
                className="h-64 bg-gray-200 rounded-2xl justify-center items-center overflow-hidden mb-6"
              >
                {image ? (
                  <Image
                    source={{ uri: image }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <>
                    <Icon name="camera" size={36} color="gray" />
                    <Text className="text-gray-400 mt-2">Add a Photo</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Caption */}
              <View className="mb-4">
                <Text className="text-base font-semibold mb-2">Caption</Text>
                <TextInput
                  value={caption}
                  onChangeText={setCaption}
                  placeholder="Write something..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="bg-gray-100 border border-gray-300 rounded-2xl p-4 text-base text-gray-800"
                />
              </View>
            </View>

            {/* Bottom Section */}
            <View>
              {!sharing ? (
                <TouchableOpacity
                  onPress={handlePost}
                  className="bg-black py-4 rounded-3xl"
                >
                  <Text className="text-white text-center text-lg font-bold">
                    Share
                  </Text>
                </TouchableOpacity>
              ) : (
                <View className="bg-gray-300 py-4 rounded-3xl">
                  <Text className="text-gray-500 text-center text-lg font-bold">
                    Sharing...
                  </Text>
                </View>
              )}
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default CreatePostScreen;
