import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import { Profile } from "@/types";
import { colors } from "@/constants";
import UploadImageComponent from "../UploadImage";

type EditProfileScreenProps = {
  profile: Profile;
  onSave: (profile: Profile) => void;
  onCancel: () => void;
};

const SLIDER_MAX_VALUE = 100;
const MAX_DISTANCE_MILES = 10000;

const predefinedInterests = [
  "Sports",
  "Music",
  "Movies",
  "Travel",
  "Books",
  "Art",
];

const EditProfileScreen = ({
  profile,
  onSave,
  onCancel,
}: EditProfileScreenProps) => {
  const [bio, setBio] = useState(profile.bio);
  const [preferredGender, setPreferredGender] = useState(
    profile.preferredGender
  );
  const [sliderValue, setSliderValue] = useState(() => {
    return profile.maxDistance === MAX_DISTANCE_MILES
      ? SLIDER_MAX_VALUE
      : profile.maxDistance;
  });
  const [isMaxDistance, setIsMaxDistance] = useState(
    profile.maxDistance === MAX_DISTANCE_MILES
  );
  const [interests, setInterests] = useState<string[]>(profile.interests);
  const [customInterest, setCustomInterest] = useState<string>("");
  const [images, setImages] = useState<string[]>(profile.images);

  const handleSave = async () => {
    const maxDistance = isMaxDistance ? MAX_DISTANCE_MILES : sliderValue;

    const updatedProfile = {
      ...profile,
      bio,
      preferredGender,
      maxDistance,
      interests,
      images,
    };

    onSave(updatedProfile);
  };

  const handleAddInterest = (interest: string) => {
    if (!interests.includes(interest)) {
      setInterests([...interests, interest]);
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter((item) => item !== interest));
  };

  const handleCustomInterest = () => {
    if (customInterest.trim()) {
      handleAddInterest(customInterest.trim());
      setCustomInterest("");
    }
  };

  const handleImageUpload = (uploadedImages: string[]) => {
    setImages(uploadedImages);
  };

  useEffect(() => {
    console.log("images", images);
  }, [images]);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="p-5">
        <Text className="text-2xl font-bold text-gray-800 mb-5">
          Edit Profile
        </Text>

        {/* Profile Images */}
        <UploadImageComponent
          onSubmit={() => handleImageUpload(images)}
          buttonTitle="Save Images"
          parentImgs={images}
          setParentImgs={setImages}
          showButton={false}
        />

        {/* Bio */}
        <View className="mb-4">
          <Text className="text-base text-gray-800">Bio</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            multiline
            className="border-b border-gray-400 p-2 text-lg"
            placeholder="Tell something about yourself"
          />
        </View>

        {/* Preferred Gender */}
        <View className="mb-4">
          <Text className="text-base text-gray-800">Preferred Gender</Text>
          <View className="flex-row justify-around mt-2">
            {["Male", "Female", "Other"].map((gender) => (
              <TouchableOpacity
                key={gender}
                onPress={() => setPreferredGender(gender)}
                className={`py-2 px-4 rounded-full ${
                  preferredGender === gender ? "bg-black" : "bg-gray-300"
                }`}
              >
                <Text className="text-white">{gender}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Max Distance */}
        <View className="mb-4">
          <Text className="text-base text-gray-800">
            Max Distance: {isMaxDistance ? "Max" : sliderValue} miles
          </Text>
          {!isMaxDistance && (
            <>
              <Slider
                minimumValue={1}
                maximumValue={SLIDER_MAX_VALUE} // Slider only goes to 100
                value={sliderValue}
                onValueChange={setSliderValue}
                step={1}
                minimumTrackTintColor={colors.black}
              />
              <TouchableOpacity
                onPress={() => setIsMaxDistance(true)}
                className={`mt-2 py-2 px-4 rounded-full bg-gray-300`}
              >
                <Text className="text-center text-blue-500">
                  Set Max Distance
                </Text>
              </TouchableOpacity>
            </>
          )}

          {isMaxDistance && (
            <TouchableOpacity
              onPress={() => setIsMaxDistance(false)}
              className={`mt-2 py-2 px-4 rounded-full bg-gray-300`}
            >
              <Text className="text-center text-blue-500">
                Set Specific Distance
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Interests */}
        <View className="mb-4">
          <Text className="text-base text-gray-800">Interests</Text>
          <ScrollView horizontal className="flex flex-row mb-4">
            {predefinedInterests.map((interest) => (
              <TouchableOpacity
                key={interest}
                className={`px-4 py-2 mr-2 rounded-full ${
                  interests.includes(interest) ? "bg-black" : "bg-gray-300"
                }`}
                onPress={() => handleAddInterest(interest)}
              >
                <Text className="text-white">{interest}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View className="flex flex-row items-center">
            <TextInput
              value={customInterest}
              onChangeText={setCustomInterest}
              placeholder="Add your own..."
              className="flex-1 p-4 text-lg border border-gray-300 rounded-full bg-white mr-2"
            />
            <TouchableOpacity
              className="p-4 bg-violet-400 rounded-lg"
              onPress={handleCustomInterest}
            >
              <Text className="text-white">Add</Text>
            </TouchableOpacity>
          </View>
          <ScrollView className="mt-4">
            {interests.map((interest) => (
              <TouchableOpacity
                key={interest}
                className="px-4 py-2 mr-2 mb-2 rounded-full bg-black"
                onPress={() => handleRemoveInterest(interest)}
              >
                <Text className="text-white">{interest}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Save & Cancel Buttons */}
        <View className="flex-row justify-between mt-10">
          <TouchableOpacity
            className="bg-red-500 py-3 px-10 rounded-full"
            onPress={onCancel}
          >
            <Text className="text-white text-lg">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-green-400 py-3 px-10 rounded-full"
            onPress={handleSave}
          >
            <Text className="text-white text-lg">Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
