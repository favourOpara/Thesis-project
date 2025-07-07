// axiosInstance.js
import axios from "axios";

const API_URL = "inspiring-spontaneity-production.up.railway.app/api/"; // Adjust this to your API's base URL

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  xsrfHeaderName: "X-CSRFToken",
  xsrfCookieName: "csrftoken",
});

export default instance;
