import React, { useState } from "react";
import {
  Button,
  Image,
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuthFetch } from "@/hooks/Privatefetch";
import { formatError } from "@/utils";

type UploadImageComponentProps = {
  onSubmit?: () => void | undefined;
  buttonTitle?: string;
};

const UploadImageComponent = ({
  onSubmit,
  buttonTitle,
}: UploadImageComponentProps) => {
  const authFetch = useAuthFetch();
  const [images, setImages] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      allowsEditing: true,
      quality: 1,
    });

    if (!result || !result.assets || result.assets.length === 0) {
      return;
    }

    const asset = result.assets as ImagePicker.ImagePickerAsset[];

    if (!result.canceled) {
      setImages((prev) => [...(prev || []), ...asset.map((a) => a.uri)]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(
      (prev) => prev?.filter((_, index) => index !== indexToRemove) || null
    );
  };

  const uploadImages = async () => {
    const formData = new FormData();
    if (!images) {
      setError("No images to upload");
      return;
    }

    for (const image of images) {
      formData.append("images", {
        uri: image,
        type: "image/jpeg",
        name: "image",
      } as any);
    }

    try {
      const response = await authFetch("/api/user/upload-images", {
        method: "PATCH",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await response?.json();
      console.log("Upload successful:", data);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleSubmit = async () => {
    console.log("handleSubmit from imgs");
    if (!images) {
      alert("At least 1 image is required");

      setError("No images to upload");
      return;
    }

    try {
      if (onSubmit) {
        try {
          await onSubmit();
          console.log("in try");
        } catch (error) {
          console.log("in catch");

          setError(formatError(error));
          return;
        }
      }
      console.log("at uploadImages");

      await uploadImages();
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <>
      <SafeAreaView className="w-full flex flex-col justify-between   ">
        <View className="flex">
          <TouchableOpacity
            className="bg-black w-full p-4 rounded-lg mb-3 "
            onPress={pickImage}
          >
            <Text className="text-white text-lg">Upload Images</Text>
          </TouchableOpacity>

          {error && !onSubmit && <Text style={{ color: "red" }}>{error}</Text>}
          {images && images.length > 0 && (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {images.map((image, index) => (
                <View
                  key={index}
                  style={{
                    width: "48%",
                    marginBottom: 10,
                    position: "relative",
                  }}
                >
                  <Image
                    source={{ uri: image }}
                    style={{ width: "100%", height: 200 }}
                  />
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      backgroundColor: "black",
                      borderRadius: 15,
                      padding: 5,
                    }}
                    onPress={() => removeImage(index)}
                  >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                      X
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
        <TouchableOpacity
          className="bg-violet-400 w-full p-4 rounded-lg "
          onPress={handleSubmit}
        >
          <Text className="text-white text-lg text-center">
            {buttonTitle || "Submit"}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

export default UploadImageComponent;
