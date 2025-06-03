import { ModeToggle } from "@/components/mode-toggle";
import { Outlet } from "react-router";

export const AuthLayout = () => {
  return (
    <div className="flex min-h-screen max-h-screen">
      <div className="p-8 flex-1">
        <Outlet />
      </div>
      <div className="p-8 flex-1">
        <img
          src="https://images.pexels.com/photos/6592358/pexels-photo-6592358.jpeg/"
          alt="Kanban Board"
          className="rounded-lg shadow-lg w-full h-full object-cover"
        />
      </div>
      <div className="absolute bottom-2 left-2">
        <ModeToggle />
      </div>
    </div>
  );
};
