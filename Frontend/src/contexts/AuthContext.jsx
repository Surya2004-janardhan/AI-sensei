import React, { createContext, useState, useEffect, useContext } from "react";
import * as authAPI from "../api/auth";
import { toast } from "react-toastify";

console.log("Loading AuthContext.jsx");

// Create the context
const AuthContext = createContext();

// Create the hook to use the context
export const useAuth = () => useContext(AuthContext);

// Export the provider component
export function AuthProvider({ children }) {
  console.log("AuthProvider rendering");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    try {
      const res = await authAPI.login(credentials);
      console.log("res: ", res);

      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    toast.success("Logout successful!", {
      position: "top-right",
      autoClose: 2000,
      style: {
        backgroundColor: "#000", // black background
        border: "1px solid lightgrey", // light grey border
        color: "#fff", // white text
      },
    });
    setUser(null);
  };

  const loadUser = async () => {
    try {
      const res = await authAPI.getProfile();
      setUser(res.data);
    } catch (error) {
      console.error("Error loading user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  console.log("AuthProvider about to return JSX");

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Also export the context itself for direct use
export { AuthContext };
