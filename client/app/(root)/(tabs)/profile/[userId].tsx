import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Dimensions,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useAuthFetch } from "@/hooks/Privatefetch";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { formatDistanceToNow } from "date-fns";
import PostCard from "@/components/feed/posts/PostCard";
import { Post, Profile } from "@/types";
import RenderImageIndicators from "@/components/feed/RenderImageIndicators";
import { Image } from "expo-image";

const { width } = Dimensions.get("window");

interface ProfileWithPosts extends Profile {
  posts: Post[];
}

export default function UserProfileScreen() {
  const { userId } = useLocalSearchParams();
  const authFetch = useAuthFetch();
  const navigation = useNavigation();
  const [profile, setProfile] = useState<ProfileWithPosts | null>(null);
  const [imgIndex, setImgIndex] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await authFetch(`/api/user/profile/${userId}`);
        const data = await response.json();
        setProfile(data.updatedProfile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (userId) fetchUserProfile();
  }, [userId]);

  if (!profile) return null;

  const handleImgClick = (event: any) => {
    const x = event.nativeEvent.locationX;
    if (x < width / 2) {
      // Tapped left

      setImgIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else {
      // Tapped right
      if (imgIndex >= profile.images.length - 1) {
        setImgIndex(0);
      } else {
        setImgIndex((prev) =>
          prev < profile.images.length - 1 ? prev + 1 : prev
        );
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="bg-white">
        {/* Hero Image */}
        <View className="relative" style={{ width, height: 400 }}>
          <RenderImageIndicators
            images={profile.images}
            currentImageIndex={imgIndex}
          />
          <TouchableOpacity
            style={{ width, height: 400 }}
            className=" "
            onPressIn={handleImgClick}
          >
            {profile.images.length > 0 && (
              <Image
                source={{ uri: profile.images[imgIndex] }}
                style={{ width, height: 400 }}
              />
            )}

            {/* Overlay */}
            <View className="absolute bottom-5 left-5 z-10">
              <Text className="text-white text-3xl font-bold">
                {profile.name}, {profile.age}
              </Text>
              <Text className="text-white text-sm mt-1 opacity-80">
                {profile.distance
                  ? `${Math.floor(profile.distance)} miles away`
                  : ""}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Floating Avatar */}
          <View className="absolute -bottom-8 right-5 z-10 bg-white rounded-full p-1 shadow-lg">
            <Image
              source={{ uri: profile.images[1] || profile.images[0] }}
              className="w-16 h-16 rounded-full"
            />
          </View>
        </View>

        {/* Bio Section */}
        <View className="mt-12 px-6 space-y-4">
          {profile.bio && (
            <Text className="text-base text-gray-700 italic">
              “{profile.bio}”
            </Text>
          )}

          {/* Interests */}
          {profile.interests?.length > 0 && (
            <View className="flex-row flex-wrap gap-2">
              {profile.interests.map((int) => (
                <View
                  key={int}
                  className="bg-teal-100 px-3 py-1 rounded-full border border-teal-300"
                >
                  <Text className="text-teal-700 font-semibold text-xs">
                    {int}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Profile Fields */}
          <View className="mt-4 space-y-2">
            {profile.jobTitle && (
              <Row icon="briefcase" label="Job" value={profile.jobTitle} />
            )}
            {profile.relationshipType && (
              <Row
                icon="users"
                label="Relationship"
                value={profile.relationshipType}
              />
            )}
            {profile.lookingFor && (
              <Row
                icon="heart"
                label="Looking for"
                value={profile.lookingFor}
              />
            )}
            {profile.drinkingHabits && (
              <Row icon="glass" label="Drinks" value={profile.drinkingHabits} />
            )}
            {profile.smokingHabits && (
              <Row icon="fire" label="Smokes" value={profile.smokingHabits} />
            )}
            {profile.pets?.length > 0 && (
              <Row icon="paw" label="Pets" value={profile.pets.join(", ")} />
            )}
            {profile.socialMedia?.instagram && (
              <Row
                icon="instagram"
                label="Instagram"
                value={`@${profile.socialMedia.instagram.split("@")[1]}`}
              />
            )}
          </View>
        </View>

        {/* Grid of Posts */}
        {profile.posts?.length > 0 && (
          <View className="mt-10 px-6">
            <Text className="text-lg font-bold text-gray-800 mb-3">Posts</Text>
            {profile.posts.map((post) => (
              <View key={post._id} className="mb-6">
                <PostCard post={post} commentsDisabled />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center space-x-3">
      <Icon name={icon} size={14} color="#0f172a" />
      <Text className="text-sm text-gray-600">
        <Text className="font-semibold">{label}:</Text> {value}
      </Text>
    </View>
  );
}
