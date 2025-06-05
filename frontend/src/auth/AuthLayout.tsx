import { ModeToggle } from "@/components/mode-toggle";
import { useTheme } from "@/components/theme-provider";
import { Outlet } from "react-router";

export const AuthLayout = () => {
  const { theme } = useTheme();
  return (
    <div className="flex min-h-screen max-h-screen">
      <div className="p-8 flex-1">
        <Outlet />
      </div>
      <div className="p-8 flex-1">
        <img
          style={{ filter: theme === "dark" ? "brightness(0.5)" : "none" }}
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
