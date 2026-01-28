import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 🔥 Handle both cases
    const hasResponse = !!error.response;

    try {
      await api.get("/auth/me");
    } catch {
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

