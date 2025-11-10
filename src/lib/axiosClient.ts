import axios, { AxiosInstance } from "axios";

export const axiosClient: AxiosInstance = axios.create({
<<<<<<< HEAD
  baseURL: "http://localhost:3050",
=======
  baseURL: "https://lap-uang-be.vercel.app",
>>>>>>> origin/v-dafizh
  headers: { "Content-Type": "application/json" },
});
