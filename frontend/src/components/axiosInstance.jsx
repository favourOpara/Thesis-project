// axiosInstance.js
import axios from "axios";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000") + "/api/";

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  xsrfHeaderName: "X-CSRFToken",
  xsrfCookieName: "csrftoken",
});

export default instance;
