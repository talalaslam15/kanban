import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, NavLink } from "react-router";
import { useAuth } from "./AuthContext";
import axios from "axios";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) setError(err?.response?.data?.message);
      else setError("Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="max-w-lg p-8 rounded-lg ">
        <h1 className="text-3xl font-bold mb-4">Welcome Back 👋</h1>
        <p className="text-lg mb-4">
          Stay organized and in control. Log in to access your boards, manage
          tasks, and keep your workflow moving forward.
        </p>

        {error && (
          <div className="bg-rose-500 text-xs text-white p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <NavLink to="/register" className="text-cyan-600 hover:underline">
            Sign up
          </NavLink>
        </p>
      </div>
    </div>
  );
};
