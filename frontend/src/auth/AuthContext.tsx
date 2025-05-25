import React, { createContext, useState, useContext, useEffect } from "react";
import api from "./api";
import { User } from "../types";
import { useNavigate } from "react-router";

// Shape of our auth state
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
}

// The context type
interface AuthContextProps {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();

  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true,
  });

  // Check for token on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setAuthState({
        isAuthenticated: true,
        token,
        user: JSON.parse(user),
        loading: false,
      });
      navigate("/");
    } else {
      setAuthState({ ...authState, loading: false });
      navigate("/login");
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post(`/auth/login`, {
        email,
        password,
      });
      const { access_token, user } = response.data;

      // Store token and user in localStorage
      if (access_token)
        if (access_token) localStorage.setItem("token", access_token);
      if (user) localStorage.setItem("user", JSON.stringify(user));
      if (user) localStorage.setItem("user", JSON.stringify(user));

      setAuthState({
        isAuthenticated: true,
        token: access_token,
        user,
        loading: false,
      });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post(`/auth/register`, {
        name,
        email,
        password,
      });
      const { access_token, user } = response.data;

      // Store token and user in localStorage
      if (access_token) localStorage.setItem("token", access_token);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      setAuthState({
        isAuthenticated: true,
        token: access_token,
        user,
        loading: false,
      });
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    // Remove token and user from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setAuthState({
      isAuthenticated: false,
      token: null,
      user: null,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
