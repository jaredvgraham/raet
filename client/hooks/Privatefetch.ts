import { useSession } from "@clerk/clerk-expo";
import { router } from "expo-router";

export const useAuthFetch = () => {
  const { session } = useSession();

  const authFetch = async (endpoint: string, options: RequestInit = {}) => {
    try {
      // const url = `${process.env.EXPO_PUBLIC_API_URL}${endpoint}`;
      const url = `http://localhost:3000${endpoint}`;
      console.log("url", url);
      const token = await session?.getToken();

      if (!token) {
        throw new Error("Unauthenticated: No token available");
      }

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
      console.log("response", response);

      if (!response.ok) {
        const errorData = await response.json(); // Parse error response body
        const error = new Error(errorData.message || "Something went wrong");
        console.log("error", error);

        (error as any).status = response.status;
        throw error;
      }

      return response;
    } catch (error: any) {
      console.error(`Error during protected fetch at: ${endpoint}`, error);
      console.log("error msg", error.message, "ENDDDDDD");

      throw error;
    }
  };

  return authFetch;
};
