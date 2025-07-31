import axios, { AxiosInstance } from "axios";

export const axiosClient: AxiosInstance = axios.create({
  baseURL: "http://localhost:3232",
  headers: { "Content-Type": "application/json" },
});
