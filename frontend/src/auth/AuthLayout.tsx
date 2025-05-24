import React from "react";
import { Outlet } from "react-router";

export const AuthLayout = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900/80 via-gray-950/90 to-black/90">
      <div className="w-full max-w-md p-8 space-y-6 rounded-2xl">
        <Outlet />
      </div>
    </div>
  );
};
