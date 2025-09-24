import React, { createContext, useContext, useState, useEffect } from "react";
import api, { attachToken } from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  useEffect(() => {
    attachToken(token);
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  async function signup({ name, email, password }) {
    const res = await api.post("/auth/signup", { name, email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    attachToken(res.data.token);
    return res.data;
  }

  async function login({ email, password }) {
    const res = await api.post("/auth/login", { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    attachToken(res.data.token);
    return res.data;
  }

  function logout() {
    setToken(null);
    setUser(null);
    attachToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
