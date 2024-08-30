import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import React from "react";
import UploadImageComponent from "@/components/UploadImage";

const likes = () => {
  const onSubmit = async () => {
    console.log("submit from parent");
  };

  return (
    <>
      <SafeAreaView>
        <TouchableOpacity onPress={onSubmit} className="w-48 h-40 bg-green-400">
          <Text className="text-black">Submit</Text>
        </TouchableOpacity>
        <UploadImageComponent onSubmit={undefined} title={"Finish"} />
      </SafeAreaView>
    </>
  );
};

export default likes;
