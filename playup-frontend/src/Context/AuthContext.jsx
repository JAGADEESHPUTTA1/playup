import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
import Loader from "../components/Loader/Loader";

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
      } catch {
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

  // 🔒 Logout
  const logout = async () => {
    localStorage.clear()
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    } finally {
      setUser(null);
    }
  };

  /* 🚫 BLOCK RENDER UNTIL AUTH IS READY */
  if (loading) {
    return <Loader text="Loading..." />;
  }

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
