import axios from "axios";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000") + "/api/";

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  xsrfHeaderName: "X-CSRFToken",
  xsrfCookieName: "csrftoken",
});

// Attach stored access token to every request as Authorization header
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default instance;
