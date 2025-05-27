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
import { createColumn } from "./api/columns.api";

interface AddColumnProps {
  boardId: string;
  position: number;
  onAddColumn: () => void;
}

export const AddColumn: React.FC<AddColumnProps> = ({
  boardId,
  position,
  onAddColumn,
}) => {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ title: "" });
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        title: form.title,
        position,
        boardId,
      };
      await createColumn(payload);
      setForm({ title: "" });
      setOpen(false);
    } catch {
      setError("Failed to add column");
    } finally {
      setSubmitting(false);
      onAddColumn();
    }
  };

  return (
    <div className="m-2 rounded-lg p-2 w-80 h-full flex flex-col justify-center items-center bg-card text-card-foreground shadow-md border-2 border-dashed border-border min-h-[200px]">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="w-full py-1.5 cursor-pointer bg-primary text-primary-foreground text-sm hover:bg-accent-foreground hover:text-accent rounded flex items-center justify-center transition-colors duration-200 hover:shadow-sm"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add a column
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new column</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddColumn} className="space-y-4">
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
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <DialogFooter>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Adding..." : "Add Column"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
