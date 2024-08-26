//axios.ts
import axios from "axios";

const axiosPublic = axios.create({
  baseURL: process.env.EXPO_PUBLIC_SERVER_URL,
});

export { axiosPublic };
