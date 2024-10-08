import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Swiper from "react-native-swiper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuthFetch } from "@/hooks/Privatefetch";
import { formatError } from "@/utils";
import UploadImageComponent from "@/components/UploadImage";
import { getUserLocation } from "@/utils/contants";

const Onboarding = () => {
  const authFetch = useAuthFetch();

  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // State for form fields
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [gender, setGender] = useState<string>("");
  const [preferredGender, setpreferredGender] = useState<string>("");
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Predefined interests
  const predefinedInterests = [
    "Sports",
    "Music",
    "Movies",
    "Travel",
    "Books",
    "Art",
  ];

  useEffect(() => {
    console.log("location", location);

    const sendLocation = async () => {
      if (location) return;
      const newLocation = await getUserLocation();
      if (!newLocation) {
        return;
      }
      const { latitude, longitude } = newLocation;
      setLocation({ latitude, longitude });

      if (!latitude || !longitude) {
        return;
      }

      try {
        const res = await authFetch("/api/user/location", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lat: latitude,
            lon: longitude,
          }),
        });
        console.log("location", res);
      } catch (error) {
        console.log("error", error);
      }
    };
    sendLocation();
  }, []);

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

  const handleSubmit = async () => {
    console.log("User Data Submitted:", {
      dateOfBirth,
      gender,
      interests,
      preferredGender,
    });
    try {
      const res = await authFetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateOfBirth,
          gender,
          interests,
          preferredGender,
        }),
      });
      console.log(res);
      router.push("/(root)/(tabs)/home");
    } catch (error: any) {
      setError(formatError(error));
      alert(error);
      throw error;
    }
  };

  const data = [
    {
      title: "What's your date of birth?",
      component: (
        <View className="w-full">
          <DateTimePicker
            value={dateOfBirth || new Date()}
            mode="date"
            display="spinner"
            onChange={(event, selectedDate) =>
              setDateOfBirth(selectedDate || dateOfBirth)
            }
            style={{ width: "100%" }}
            textColor="black"
          />
        </View>
      ),
    },
    {
      title: "What's your gender?",
      component: (
        <View className="flex flex-row justify-around w-full  ">
          <TouchableOpacity
            className={`p-4 rounded-lg w-4/12 m-2 shadow-2xl ${
              gender === "Male" ? "bg-blue-600" : "bg-gray-300"
            }`}
            onPress={() => setGender("Male")}
          >
            <Text className="text-white text-center">Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`p-4 rounded-lg w-4/12 m-2 text-center ${
              gender === "Female" ? "bg-pink-500" : "bg-gray-300"
            }`}
            onPress={() => setGender("Female")}
          >
            <Text className="text-white text-center">Female</Text>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      title: "Who should we show you?",
      component: (
        <View className="flex flex-row justify-around w-full  ">
          <TouchableOpacity
            className={`p-4 rounded-lg w-3/12 m-2 ${
              preferredGender === "Male" ? "bg-blue-600" : "bg-gray-300"
            }`}
            onPress={() => setpreferredGender("Male")}
          >
            <Text className="text-white text-center">Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`p-4 rounded-lg w-3/12 m-2 text-center ${
              preferredGender === "Female" ? "bg-pink-500" : "bg-gray-300"
            }`}
            onPress={() => setpreferredGender("Female")}
          >
            <Text className="text-white text-center">Female</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`p-4 rounded-lg w-3/12 m-2 text-center ${
              preferredGender === "Both" ? "bg-indigo-300" : "bg-gray-300"
            }`}
            onPress={() => setpreferredGender("Both")}
          >
            <Text className="text-white text-center">Both</Text>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      title: "What are your interests?",
      component: (
        <View className="w-full">
          <ScrollView horizontal className="flex flex-row mb-4">
            {predefinedInterests.map((interest) => (
              <TouchableOpacity
                key={interest}
                className={`px-4 py-2 mr-2 rounded-full ${
                  interests.includes(interest) ? "bg-violet-300" : "bg-gray-300"
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
              placeholderTextColor="#6B7280"
              className="flex-1 p-3 text-lg border border-gray-300 rounded-full bg-white mr-2"
            />
            <TouchableOpacity
              className="p-4 bg-teal-400 rounded-lg"
              onPress={handleCustomInterest}
            >
              <Text className="text-white">Add</Text>
            </TouchableOpacity>
          </View>
          <ScrollView className="mt-4">
            {interests.map((interest) => (
              <TouchableOpacity
                key={interest}
                className="px-4 py-2 mr-2 mb-2 rounded-full  bg-violet-300"
                onPress={() => handleRemoveInterest(interest)}
              >
                <Text className="text-white">{interest}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ),
    },
    {
      title: "Pick your best pictures",
      component: (
        <UploadImageComponent
          onSubmit={handleSubmit as any}
          buttonTitle="Finish"
        />
      ),
    },
  ];

  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-slate-100">
      {error && <Text className="text-red-500 text-lg">{error}</Text>}
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={<View className="w-4 h-4 bg-gray-300 rounded-full mx-1" />}
        activeDot={<View className="w-4 h-4 bg-black rounded-full mx-1" />}
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {data.map((item, index) => (
          <View
            key={index}
            className="flex flex-col items-center justify-center h-3/4 px-6 "
          >
            <Text className="text-3xl font-light text-gray-700 mb-6 text-center">
              {item.title}
            </Text>
            {item.component}
          </View>
        ))}
      </Swiper>
      {activeIndex !== data.length - 1 && (
        <TouchableOpacity
          className="w-4/5 p-4 bg-black rounded-lg justify-center items-center mb-6"
          onPress={() => {
            swiperRef.current?.scrollBy(1);
          }}
        >
          <Text className="text-white text-lg font-bold">
            {activeIndex === data.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default Onboarding;
