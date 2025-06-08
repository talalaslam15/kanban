import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./components/ui/dialog";
import { Button } from "./components/ui/button";
import { Board } from "./types";
import { createBoard } from "./features/boards/boards.api";

interface AddBoardDialogProps {
  ownerId: string;
  onBoardAdded: (_board: Board) => void;
}

export const AddBoardDialog: React.FC<AddBoardDialogProps> = ({
  ownerId,
  onBoardAdded,
}) => {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ title: "", description: "" });
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        title: form.title,
        description: form.description,
        ownerId,
      };
      const newBoard = await createBoard(payload);
      setForm({ title: "", description: "" });
      setOpen(false);
      onBoardAdded(newBoard);
    } catch {
      setError("Failed to add board");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          + Add Board
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new board</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddBoard} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
              rows={3}
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Adding..." : "Add Board"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
