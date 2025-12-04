// src/contexts/AuthContext.tsx

import { createContext, useContext, useState, ReactNode } from "react";
import { loginUser } from "@/api/authAPI";
import { createUser } from "@/api/userAPI";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  // SIGNUP → userAPI.ts
  const signup = async (name: string, email: string, password: string) => {
    try {
      await createUser(name, email, password);
      return true;
    } catch (err) {
      return false;
    }
  };

  // LOGIN → authAPI.ts
  const login = async (email: string, password: string) => {
    try {
      const data = await loginUser(email, password);

      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);

      return true;
    } catch (err) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
