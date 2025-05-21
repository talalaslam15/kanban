import React from "react";
import { Route, Routes } from "react-router";
import App from "./App";
import { AuthLayout } from "./auth/AuthLayout";
import { Login } from "./auth/Login";
import { Register } from "./auth/Register";
import { AuthProvider } from "./auth/AuthContext";

export const Router = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};
