export interface User {
  _id: string;
  name: string;
  email: string;
  clerkId: string;
  dob?: Date;
  images?: string[];
  location?: {
    type: string;
    coordinates: [number, number];
  };
  maxDistance?: number;
  interests?: string[];
  preferredAgeRange?: [number, number];
  preferredGender?: "Male" | "Female";
  likedUsers?: string[];
  viewedUsers?: {
    userId: string;
    viewedAt: Date;
  }[];
  matchedUsers?: string[];
}

export interface Profile {
  _id: string;
  name: string;
  clerkId: string;
  email: string;
  gender: string;
  preferredGender: string;
  maxDistance: number;
  matchedUsers: string[];
  recentPosts: Post[];

  bio?: string;
  age: number;
  location: {
    type: string;
    coordinates: [number, number];
  };
  images: string[];
  distance: number;
  interests: string[];
  preferredAgeRange: [number, number];
  likedUsers: string[];
  lookingFor: string;
  relationshipType: string;
  jobTitle: string;
  pets: string[];
  drinkingHabits: string;
  smokingHabits: string;
  socialMedia: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
  matchScore: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  receiverViewed: boolean;
  message: string;
  sentAt: Date;
}

export interface MatchedUser {
  clerkId: string;
  images: string[];
  name: string;
}

export interface Conversation {
  matchId: string;
  matchedUser: MatchedUser;
  lastMessage: Message;
}

export interface Post {
  _id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  caption: string;
  imageUrl: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  likedByCurrentUser: boolean;
}

export interface Comment {
  _id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
}
