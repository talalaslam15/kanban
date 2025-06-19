import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./components/ui/dialog";
import { Button } from "./components/ui/button";
import { Card } from "./types";

interface CardFormProps {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
  initialValues?: Partial<Card>;
  onSubmit: (_values: { title: string; description: string }) => Promise<void>;
  title: string;
  submitLabel: string;
  isSubmitting: boolean;
  error?: string;
  children?: React.ReactNode;
}

export const CardDialog: React.FC<CardFormProps> = ({
  open,
  onOpenChange,
  initialValues = { title: "", description: "" },
  onSubmit,
  title,
  submitLabel,
  isSubmitting,
  error,
  children,
}) => {
  const [form, setForm] = React.useState({
    title: initialValues.title || "",
    description: initialValues.description || "",
  });

  // Update form when initialValues change (for editing)
  React.useEffect(() => {
    if (open) {
      setForm({
        title: initialValues.title || "",
        description: initialValues.description || "",
      });
    }
  }, [initialValues, open]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
