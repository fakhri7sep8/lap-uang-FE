import axios, { AxiosInstance } from "axios";

export const axiosClient: AxiosInstance = axios.create({
  baseURL: "https://lap-uang-be.vercel.app",
  headers: { "Content-Type": "application/json" },
});
