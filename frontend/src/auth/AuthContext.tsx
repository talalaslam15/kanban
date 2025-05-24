import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
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

// API base URL
const API_URL = "http://localhost:3000";

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

      // Set default auth header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      setAuthState({ ...authState, loading: false });
      navigate("/login");
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { access_token, user } = response.data;

      // Store token and user in localStorage
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      // Set default auth header
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

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
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });
      const { token, user } = response.data;

      // Store token and user in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Set default auth header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setAuthState({
        isAuthenticated: true,
        token,
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

    // Remove auth header
    delete axios.defaults.headers.common["Authorization"];

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
