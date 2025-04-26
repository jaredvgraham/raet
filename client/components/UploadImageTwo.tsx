import React, { useState } from "react";
import {
  Button,
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuthFetch } from "@/hooks/Privatefetch";
import { formatError } from "@/utils";
import { Image } from "expo-image";
import Icon from "react-native-vector-icons/FontAwesome";

type UploadImageComponentProps = {
  onSubmit?: () => void | undefined;
  buttonTitle?: string;
  parentImgs?: string[] | null;
  setParentImgs?: (images: string[]) => void;
  showButton?: boolean;
};

const UploadImageComponentTwo = ({
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
      <View className="w-full flex flex-col justify-between   ">
        <Text className="text-2xl font-normal mb-4">Images:</Text>

        <View className="flex">
          {error && !onSubmit && <Text style={{ color: "red" }}>{error}</Text>}

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {Array.from({ length: 6 }).map((_, index) => {
              const image = images ? images[index] : null;

              return (
                <View
                  key={index}
                  style={{
                    width: "48%",
                    marginBottom: 10,
                    position: "relative",
                    backgroundColor: "#f0f0f0", // Light gray background for empty slots
                    borderRadius: 10,
                    height: 200,
                    overflow: "hidden",
                  }}
                >
                  {image ? (
                    <>
                      <Image
                        source={{ uri: image }}
                        style={{ width: "100%", height: "100%" }}
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
                    </>
                  ) : (
                    <>
                      {/* + icon */}
                      <TouchableOpacity
                        className="flex-1 items-center justify-center"
                        onPress={pickImage}
                      >
                        <Icon
                          name="plus" // Replace with a valid icon name
                          size={30}
                          color="gray"
                          style={{ marginBottom: 5 }}
                        />
                        <Text className="text-gray-400">Add Image</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Upload Button */}
        {showButton && (
          <TouchableOpacity
            className="bg-violet-400 w-full p-4 rounded-lg "
            onPress={handleSubmit}
          >
            <Text className="text-white text-lg text-center">
              {buttonTitle || "Submit"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default UploadImageComponentTwo;
