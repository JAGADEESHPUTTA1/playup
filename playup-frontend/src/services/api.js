import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔴 Redirect on ANY API failure
    if (error.response) {
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);
