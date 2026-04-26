// axiosInstance.js
import axios from "axios";

const API_URL = "http://localhost:8000/api/"; // Adjust this to your API's base URL

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  xsrfHeaderName: "X-CSRFToken",
  xsrfCookieName: "csrftoken",
});

export default instance;
