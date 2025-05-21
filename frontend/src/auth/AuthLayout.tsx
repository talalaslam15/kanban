import React from "react";
import { Outlet } from "react-router";

export const AuthLayout = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950">
      <div className="w-full max-w-md p-8 space-y-6 bg-black rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-200">
          Welcome to Our App
        </h2>
        <p className="text-center text-gray-600">
          Please log in or register to continue.
        </p>
        <div className="flex flex-col space-y-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
