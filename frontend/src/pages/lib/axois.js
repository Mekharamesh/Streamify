import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api", // your backend URL
  withCredentials: true,
});

export const getAuthUser = async ()=>{
  const res = await axiosInstance.get("/auth/me");
  return res.data;
}
