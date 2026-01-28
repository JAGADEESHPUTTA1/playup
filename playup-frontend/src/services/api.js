import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    try {
      await api.get("/auth/me");
    } catch {
      // auth failed → redirect
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);
