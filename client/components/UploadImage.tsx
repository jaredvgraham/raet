import React, { useState } from "react";
import { Button, Image, TouchableOpacity, View, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuthFetch } from "@/hooks/Privatefetch";

type UploadImageComponentProps = {
  onSubmit?: () => void | undefined;
};

const UploadImageComponent = ({ onSubmit }: UploadImageComponentProps) => {
  const authFetch = useAuthFetch();
  const [images, setImages] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result || !result.assets || result.assets.length === 0) {
      return;
    }

    const asset = result.assets[0] as ImagePicker.ImagePickerAsset;

    if (!result.canceled && asset.uri) {
      setImages((prev) => [...(prev || []), asset.uri]);
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
    try {
      await uploadImages();
      if (onSubmit) {
        onSubmit();
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <View className="w-full flex flex-col">
      <Button title="Pick Images" onPress={pickImage} />
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
              style={{ width: "48%", marginBottom: 10, position: "relative" }}
            >
              <Image
                source={{ uri: image }}
                style={{ width: "100%", height: 100 }}
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
                <Text style={{ color: "white", fontWeight: "bold" }}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      <Button title="Upload Images" onPress={handleSubmit} />
    </View>
  );
};

export default UploadImageComponent;
