import { useSession } from "@clerk/clerk-expo";
import { router } from "expo-router";

export const useAuthFetch = () => {
  const { session } = useSession();

  const authFetch = async (endpoint: string, options: RequestInit = {}) => {
    try {
      const url = `${process.env.EXPO_PUBLIC_API_URL}${endpoint}`;
      // Get the token from Clerk session
      const token = await session?.getToken();

      // Set the Authorization header
      const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };

      // Perform the fetch request
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Check for 401 Unauthorized response
      if (response.status === 401) {
        // Redirect to the sign-in screen
        router.replace("/(auth)/sign-in");
        return null;
      }

      // Return the response if not 401
      return response;
    } catch (error) {
      console.error("Error during protected fetch:", error);
      throw error;
    }
  };

  return authFetch;
};
