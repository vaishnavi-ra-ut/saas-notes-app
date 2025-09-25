import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

 
useEffect(() => {
  const interceptor = api.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );
  return () => api.interceptors.response.eject(interceptor);
}, []);


  async function login({ email, password }) {
    const res = await api.post("/auth/login", { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    // attachToken(res.data.token);
    return res.data;
  }

  function logout() {
    setToken(null);
    setUser(null);
    // attachToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, user,  login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
