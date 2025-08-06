import axios from "axios";

const BASE_API_URL = "https://theralink-backend.onrender.com";

const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

export default api;
