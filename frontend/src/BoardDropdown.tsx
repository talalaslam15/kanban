import React from "react";
import { Board } from "./types";
import { Button } from "./components/ui/button";
import { AddBoardDialog } from "./AddBoardDialog";
import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "./components/ui/popover";

interface BoardDropdownProps {
  boards: Board[];
  currentBoard: Board | undefined;
  onSelect: (_board: Board) => void;
  onAddBoard: () => void;
}

export const BoardDropdown: React.FC<BoardDropdownProps> = ({
  boards,
  currentBoard,
  onSelect,
  onAddBoard,
}) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="min-w-[180px] justify-between">
          {currentBoard?.title || "Select board"}
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-56" align="start">
        <ul className="py-2">
          {boards.map((board) => (
            <li
              key={board.id}
              className={`px-4 py-2 cursor-pointer hover:bg-accent ${
                currentBoard?.id === board.id ? "bg-accent" : ""
              }`}
              onClick={() => {
                setOpen(false);
                onSelect(board);
              }}
            >
              {board.title}
            </li>
          ))}
          <li className="px-4 py-2 border-t border-border">
            <AddBoardDialog
              ownerId={
                typeof currentBoard?.ownerId === "string"
                  ? currentBoard.ownerId
                  : ""
              }
              onBoardAdded={(board) => {
                setOpen(false);
                onAddBoard();
                onSelect(board);
              }}
            />
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
};
