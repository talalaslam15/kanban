import React, { createContext, useState, useContext, useEffect } from "react";
import api from "./api";
import { User } from "../types";
import { useNavigate } from "react-router";

const authPages = ["/login", "/register"];
const isAuthPage = authPages.includes(window.location.pathname);

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
  login: (_email: string, _password: string) => Promise<void>;
  register: (_name: string, _email: string, _password: string) => Promise<void>;
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

  // Check for token and validate user on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token && !isAuthPage) {
        setAuthState((prev) => ({ ...prev, loading: false }));
        navigate("/login");
        return;
      }
      try {
        const response = await api.get("/auth/me");
        const user = response.data;
        setAuthState((prev) => ({
          ...prev,
          isAuthenticated: true,
          user,
          token,
          loading: false,
        }));
        // If user is on an auth page (login/register) and already authenticated, redirect to home
        if (isAuthPage) {
          navigate("/");
        }
      } catch {
        console.error("Authentication check failed");
      }
    };
    checkAuth();
  }, [navigate]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post(`/auth/login`, {
        email,
        password,
      });
      const { access_token, user } = response.data;
      if (access_token) localStorage.setItem("token", access_token);
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

export default AuthProvider;
