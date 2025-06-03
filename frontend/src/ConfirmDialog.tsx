import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./components/ui/dialog";
import { Button } from "./components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
  title?: string;
  description?: string;
  loading?: boolean;
  error?: string;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  loading = false,
  error = "",
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="py-2">{description}</div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Deleting..." : confirmLabel}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
