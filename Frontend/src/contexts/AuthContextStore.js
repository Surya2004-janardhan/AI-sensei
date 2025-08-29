import { createContext, useContext } from "react";

// Create the AuthContext
export const AuthContext = createContext();

// Create a custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
