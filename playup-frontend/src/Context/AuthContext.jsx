import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Check session on app load
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  // 🔑 Call after successful login / OTP verify
  const login = async () => {
    const res = await api.get("/auth/me");
    setUser(res.data.user);
  };

  // 🔒 Logout (cookie cleared in backend — next step)
  const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    // ignore error, still clear state
  } finally {
    setUser(null);
  }
};


  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
