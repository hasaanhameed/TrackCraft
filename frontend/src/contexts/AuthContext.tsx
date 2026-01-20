// src/contexts/AuthContext.tsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { loginUser } from "@/api/authAPI";
import { createUser, getCurrentUser } from "@/api/userAPI";

interface User {
  id: number;
  email: string;
  name: string;
  monthly_limit?: number | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  setUser: (user: User | null) => void;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Fetch user data when token exists but user doesn't
  useEffect(() => {
    const fetchUserData = async () => {
      if (token && !user) {
        try {
          const userData = await getCurrentUser(token);
          updateUser(userData);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          // Token might be invalid, logout
          logout();
        }
      }
    };

    fetchUserData();
  }, [token]);

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

      // Fetch and set user data
      const userData = await getCurrentUser(data.access_token);
      updateUser(userData);

      return true;
    } catch (err) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData: User | null) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  };

  // Function to refresh user data (useful after updating profile/limit)
  const refreshUser = async () => {
    if (token) {
      try {
        const userData = await getCurrentUser(token);
        updateUser(userData);
      } catch (error) {
        console.error("Failed to refresh user data:", error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        user,
        setUser: updateUser,
        signup,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
