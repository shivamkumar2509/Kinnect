import React, { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //load logged-in user on refresh
  const fetchMe = async () => {
    try {
      const res = await API.get("/users/me");
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = async (data) => {
    const res = await API.post("/auth/login", data);
    setUser(res.data.user);
  };

  const signup = async (data) => {
    const res = await API.post("/auth/signup", data);
    setUser(null);
  };

  const logout = async () => {
    await API.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, fetchMe, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
