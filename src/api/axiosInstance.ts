import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

const BASE_URL: string = process.env.REACT_APP_API_BASE_URL ?? "http://localhost:3000";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const sessionId = sessionStorage.getItem("sessionId");
    if (sessionId && config.headers) {
      config.headers.Authorization = `Bearer ${sessionId}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      sessionStorage.clear();
      window.location.assign("/login");
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;