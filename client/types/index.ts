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
  bio?: string;
  age: number;
  images: string[];
  distance: number;
  interests: string[];
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
