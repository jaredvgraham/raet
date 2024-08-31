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
  message: string;
  sentAt: Date;
}
