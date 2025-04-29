import React, { useState } from "react";
import {
  Button,
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuthFetch } from "@/hooks/Privatefetch";
import { formatError } from "@/utils";
import { Image } from "expo-image";

type UploadImageComponentProps = {
  onSubmit?: () => void | undefined;
  buttonTitle?: string;
  parentImgs?: string[] | null;
  setParentImgs?: (images: string[]) => void;
  showButton?: boolean;
};

const UploadImageComponent = ({
  onSubmit,
  buttonTitle,
  parentImgs,
  setParentImgs,
  showButton = true,
}: UploadImageComponentProps) => {
  const authFetch = useAuthFetch();
  const [images, setImages] = useState<string[] | null>(parentImgs || null);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,

      quality: 1,
    });

    if (!result || !result.assets || result.assets.length === 0) {
      return;
    }

    const asset = result.assets as ImagePicker.ImagePickerAsset[];

    if (parentImgs && setParentImgs && !result.canceled) {
      setParentImgs([...parentImgs, ...asset.map((a) => a.uri)]);
    }

    if (!result.canceled) {
      setImages((prev) => [...(prev || []), ...asset.map((a) => a.uri)]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    if (parentImgs && setParentImgs) {
      // @ts-ignore
      setParentImgs((prev) => {
        console.log(typeof prev, "prev");

        return (prev as string[]).filter((_, index) => index !== indexToRemove);
      });
    }
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

  return (
    <>
      <SafeAreaView className="w-full flex flex-col justify-between   ">
        <View className="flex">
          <TouchableOpacity
            className="bg-black w-full p-4 rounded-lg mb-3 "
            onPress={() => {
              if ((images || []).length < 2) {
                pickImage();
              } else {
                Alert.alert("Max 2 images for now");
              }
            }}
          >
            <Text className="text-white text-lg">
              {!images?.length ? "Upload Images" : "More Images"}
            </Text>
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
                    className="rounded-lg"
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
        {showButton && (
          <TouchableOpacity
            className="bg-violet-400 w-full p-4 rounded-lg "
            onPress={onSubmit}
          >
            <Text className="text-white text-lg text-center">
              {buttonTitle || "Submit"}
            </Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </>
  );
};

export default UploadImageComponent;
