//axios.ts
import axios from "axios";

const axiosPublic = axios.create({
  baseURL: process.env.API_URL,
});

export { axiosPublic };
