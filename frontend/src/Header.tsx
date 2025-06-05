import { useState, useEffect } from "react";
import { useAuth } from "./auth/AuthContext";
import { useNavigate } from "react-router";
import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";
import { Board } from "./types";
import { getBoards } from "./api/boards.api";
import { BoardDropdown } from "./BoardDropdown";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";

type P = {
  board: Board | null;
  onBoardChange?: (_board: Board) => void;
};

export const Header = ({ board, onBoardChange }: P) => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    if (authState.isAuthenticated) {
      getBoards().then(setBoards);
    }
  }, [authState.isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSelectBoard = (b: Board) => {
    if (onBoardChange) onBoardChange(b);
  };

  return (
    <header className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <BoardDropdown
          boards={boards}
          currentBoard={board}
          onSelect={handleSelectBoard}
          onAddBoard={async () => {
            // Refetch boards after dialog adds a new board
            const updated = await getBoards();
            setBoards(updated);
          }}
        />
      </div>
      {authState.isAuthenticated && authState.user && (
        <div className="flex items-center gap-4">
          <ModeToggle />
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate(`/profile`)}
          >
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />

              <AvatarFallback>
                {authState.user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <span
              className="font-medium"
              style={{ color: "var(--color-secondary-foreground)" }}
              onClick={() => navigate(`/profile`)}
            >
              {authState.user.name || authState.user.email}
            </span>
          </div>
          <Button onClick={handleLogout} color="secondary">
            Logout
          </Button>
        </div>
      )}
    </header>
  );
};
