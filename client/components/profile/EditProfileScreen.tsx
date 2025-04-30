import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";

import Icon from "react-native-vector-icons/FontAwesome";
import { Profile } from "@/types";
import Header from "../header";
import ModernCard from "../feed/ScrollableCard";
import UploadImageComponentTwo from "../UploadImageTwo";
import PostFeedScreen from "../feed/posts/PostFeed";

const SLIDER_MAX_VALUE = 100;
const MAX_DISTANCE_MILES = 10000;

const relationshipOptions = [
  "Monogamous",
  "Polyamorous",
  "Open",
  "Swinger",
  "Other",
];
const preferredGenderOptions = ["Male", "Female", "Both"];
const lookingForOptions = ["Short-term", "Long-term", "IDK"];
const drinkingOptions = ["Never", "Social", "Regular"];
const smokingOptions = ["Never", "Social", "Often"];
const interestsOptions = [
  "Music",
  "Sports",
  "Movies",
  "Books",
  "Fitness",
  "Travel",
  "Food",
  "Art",
  "Tech",
  "Tattoos",
];

type EditProfileScreenProps = {
  profile: Profile;
  onSave: (profile: Profile) => void;
  onCancel: () => void;
};

const EditProfileScreen = ({
  profile,
  onSave,
  onCancel,
}: EditProfileScreenProps) => {
  const [preview, setPreview] = useState(false);
  const [viewPosts, setViewPosts] = useState(false);
  const [bio, setBio] = useState(profile.bio || "");
  const [jobTitle, setJobTitle] = useState(profile.jobTitle || "");
  const [relationshipType, setRelationshipType] = useState(
    profile.relationshipType || ""
  );
  const [lookingFor, setLookingFor] = useState(profile.lookingFor || "");
  const [preferredAgeRange, setPreferredAgeRange] = useState(
    profile.preferredAgeRange ? profile.preferredAgeRange.join(", ") : ""
  );
  const [interests, setInterests] = useState<string[]>(profile.interests || []);
  const [drinkingHabits, setDrinkingHabits] = useState(
    profile.drinkingHabits || ""
  );
  const [smokingHabits, setSmokingHabits] = useState(
    profile.smokingHabits || ""
  );
  const [preferredGender, setPreferredGender] = useState(
    profile.preferredGender || ""
  );
  const [sliderValue, setSliderValue] = useState(
    profile.maxDistance === MAX_DISTANCE_MILES
      ? SLIDER_MAX_VALUE
      : profile.maxDistance || 10
  );
  const [isMaxDistance, setIsMaxDistance] = useState(
    profile.maxDistance === MAX_DISTANCE_MILES
  );
  const [images, setImages] = useState<string[]>(profile.images || []);
  const [instagram, setInstagram] = useState(
    profile.socialMedia?.instagram || ""
  );
  const [pets, setPets] = useState(profile.pets?.join(", ") || "");

  const handleSave = () => {
    const maxDistance = isMaxDistance ? MAX_DISTANCE_MILES : sliderValue;
    const formattedAgeRange = preferredAgeRange
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n)) as [number, number];

    onSave({
      ...profile,
      bio,
      jobTitle,
      relationshipType,
      lookingFor,
      preferredAgeRange: formattedAgeRange,
      interests,
      drinkingHabits,
      smokingHabits,
      preferredGender,
      maxDistance,
      images,
      pets: pets.split(",").map((p) => p.trim()),
      socialMedia: { instagram },
    });
  };

  const renderField = (
    label: string,
    value: string,
    setValue: (val: string) => void,
    icon: string,
    placeholder: string
  ) => (
    <View className="mb-5">
      <View className="flex-row items-center mb-1">
        <Icon name={icon} size={16} color="#0f172a" />
        <Text className="ml-2 text-gray-800 font-semibold">{label}</Text>
      </View>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        className="border border-gray-300 rounded-xl px-4 py-2 text-gray-800 bg-white"
      />
    </View>
  );

  const renderOptions = (
    label: string,
    icon: string,
    value: string,
    setValue: (val: string) => void,
    options: string[]
  ) => (
    <View className="mb-5">
      <View className="flex-row items-center mb-2">
        <Icon name={icon} size={16} color="#0f172a" />
        <Text className="ml-2 text-gray-800 font-semibold">{label}</Text>
      </View>
      <View className="flex-row flex-wrap gap-2 mt-1">
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            className={`px-4 py-2 rounded-full ${
              value === opt ? "bg-black" : "bg-gray-200"
            }`}
            onPress={() => setValue(opt)}
          >
            <Text
              className={`font-medium ${
                value === opt ? "text-white" : "text-gray-700"
              }`}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderMultiSelect = (
    label: string,
    icon: string,
    values: string[],
    setValues: (val: string[]) => void,
    options: string[]
  ) => (
    <View className="mb-5">
      <View className="flex-row items-center mb-2">
        <Icon name={icon} size={16} color="#0f172a" />
        <Text className="ml-2 text-gray-800 font-semibold">{label}</Text>
      </View>
      <View className="flex-row flex-wrap gap-2 mt-1">
        {options.map((opt) => {
          const isSelected = values.includes(opt);
          return (
            <TouchableOpacity
              key={opt}
              className={`px-4 py-2 rounded-full ${
                isSelected ? "bg-black" : "bg-gray-200"
              }`}
              onPress={() =>
                isSelected
                  ? setValues(values.filter((v) => v !== opt))
                  : setValues([...values, opt])
              }
            >
              <Text
                className={`font-medium ${
                  isSelected ? "text-white" : "text-gray-700"
                }`}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  // If viewing posts
  if (viewPosts) {
    return (
      <>
        {/** Header remains visible always */}
        <View className="flex-row items-center justify-around px-5 py-3 bg-white border-b border-gray-200">
          <TouchableOpacity
            onPress={() => {
              setPreview(false);
              setViewPosts(false);
            }}
          >
            <Text className="text-[#10b5b1]">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setPreview(true);
              setViewPosts(false);
            }}
          >
            <Text className="text-[#10b5b1]">Preview</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setViewPosts(true);
              setPreview(false);
            }}
          >
            <Text className="text-[#10b5b1]">Posts</Text>
          </TouchableOpacity>
        </View>

        <PostFeedScreen
          parentPosts={(profile as any).posts || []}
          hideLinks={true}
        />
      </>
    );
  }

  // If previewing profile
  if (preview) {
    return (
      <>
        <View className="flex-row items-center justify-around px-5 py-3 bg-white border-b border-gray-200">
          <TouchableOpacity
            onPress={() => {
              setPreview(false);
              setViewPosts(false);
            }}
          >
            <Text className="text-[#10b5b1]">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setPreview(true);
              setViewPosts(false);
            }}
          >
            <Text className="text-[#10b5b1]">Preview</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setViewPosts(true);
              setPreview(false);
            }}
          >
            <Text className="text-[#10b5b1]">Posts</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 bg-black">
          <View className="flex-1 w-full items-center relative rounded-xl pb-1">
            <ModernCard
              user={{
                ...profile,
                recentPosts: (profile as any).posts || [],
                images: images.length ? images : profile.images,
                bio,
                jobTitle,
                relationshipType,
                lookingFor,
                preferredAgeRange: preferredAgeRange
                  .split(",")
                  .map((s) => parseInt(s.trim(), 10))
                  .filter((n) => !isNaN(n)) as [number, number],
                interests,
                drinkingHabits,
                smokingHabits,
                preferredGender,
                maxDistance: isMaxDistance ? MAX_DISTANCE_MILES : sliderValue,
                pets: pets.split(",").map((p) => p.trim()),
                distance: 0,
              }}
              onSwipe={() => setPreview(false)}
              isBackCard={false}
            />
          </View>
        </View>
      </>
    );
  }

  // Default to edit mode

  return (
    <>
      {/* Header */}
      <View className="flex-row items-center justify-around px-5 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => setPreview(false)}>
          <Text className="text-[#10b5b1]">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPreview(true)}>
          <Text className="text-[#10b5b1]">Preview</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setViewPosts(!viewPosts);
            setPreview(false);
          }}
        >
          <Text className="text-[#10b5b1]">Posts</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="p-5 flex-1 bg-white"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <UploadImageComponentTwo
          onSubmit={() => {}}
          buttonTitle="Save Images"
          parentImgs={images}
          setParentImgs={setImages}
          showButton={false}
        />

        {renderField(
          "Job Title",
          jobTitle,
          setJobTitle,
          "briefcase",
          "What do you do?"
        )}
        {renderField(
          "Bio",
          bio,
          setBio,
          "info-circle",
          "Tell us something about you..."
        )}
        {renderField(
          "Pets",
          pets,
          setPets,
          "paw",
          "List your pets separated by commas"
        )}
        {renderField(
          "Instagram",
          instagram,
          setInstagram,
          "instagram",
          "@yourhandle"
        )}
        {renderField(
          "Preferred Age Range",
          preferredAgeRange,
          setPreferredAgeRange,
          "calendar",
          "e.g. 18, 25"
        )}

        {renderMultiSelect(
          "Interests",
          "star",
          interests,
          setInterests,
          interestsOptions
        )}
        {renderOptions(
          "Preferred Gender",
          "genderless",
          preferredGender,
          setPreferredGender,
          preferredGenderOptions
        )}
        {renderOptions(
          "Looking For",
          "heart",
          lookingFor,
          setLookingFor,
          lookingForOptions
        )}
        {renderOptions(
          "Relationship Type",
          "users",
          relationshipType,
          setRelationshipType,
          relationshipOptions
        )}
        {renderOptions(
          "Drinking Habits",
          "glass",
          drinkingHabits,
          setDrinkingHabits,
          drinkingOptions
        )}
        {renderOptions(
          "Smoking Habits",
          "fire",
          smokingHabits,
          setSmokingHabits,
          smokingOptions
        )}

        {/* Distance */}
        <View className="mb-6">
          <View className="flex-row items-center mb-1">
            <Icon name="map" size={16} color="#0f172a" />
            <Text className="ml-2 text-gray-800 font-semibold">
              Max Distance: {isMaxDistance ? "Max" : sliderValue} miles
            </Text>
          </View>
          <Slider
            minimumValue={1}
            maximumValue={SLIDER_MAX_VALUE}
            value={isMaxDistance ? SLIDER_MAX_VALUE : sliderValue}
            onValueChange={(value) => {
              setIsMaxDistance(false); // As soon as user moves slider, disable max
              setSliderValue(value);
            }}
            step={1}
            minimumTrackTintColor="#14b8a6"
          />
          <TouchableOpacity
            className="mt-2"
            onPress={() => setIsMaxDistance(!isMaxDistance)}
          >
            <Text className="text-teal-600 text-sm">
              {isMaxDistance ? "Set Specific Distance" : "Set Max Distance"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Buttons */}
        <View className="flex-row justify-between mt-10">
          <TouchableOpacity
            className="bg-red-800 py-3 px-8 rounded-full"
            onPress={onCancel}
          >
            <Text className="text-white text-lg">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-black py-3 px-8 rounded-full"
            onPress={handleSave}
          >
            <Text className="text-white text-lg">Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

export default EditProfileScreen;
