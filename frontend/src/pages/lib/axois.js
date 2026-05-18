import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.DEV
    ? "http://localhost:5001/api"
    : "/api",

  withCredentials: true,
});

export const getAuthUser = async () => {
  const res = await axiosInstance.get("/auth/me");
  return res.data;
};