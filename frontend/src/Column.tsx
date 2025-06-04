import React from "react";
import { Card, CardState, type List } from "./types";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { CardComponent } from "./Card";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./components/ui/dialog";
import { Button } from "./components/ui/button";
import api from "./auth/api";
import { updateTask } from "./api/tasks.api";
import { updateColumn, deleteColumn } from "./api/columns.api";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "./components/ui/popover";
import { MoreVertical } from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";

function isCardData(data: unknown): data is { card: Card; listId: string } {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const candidate1 = data as Record<string, unknown>;

  return (
    typeof candidate1.card === "object" &&
    candidate1.card !== null &&
    typeof candidate1.listId === "string"
  );
}
type ColumnDropTargetData = {
  data: {
    list: List;
    listId: string;
  };
};

function isColumnDropTargetData(data: unknown): data is ColumnDropTargetData {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const candidate2 = data as Record<string, unknown>;

  if (typeof candidate2.data !== "object" || candidate2.data === null) {
    return false;
  }

  const nestedData = candidate2.data as Record<string, unknown>;

  return (
    typeof nestedData.list === "object" &&
    nestedData.list !== null &&
    typeof nestedData.listId === "string"
  );
}

type P = {
  list: List;
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
};

const idle: CardState = { type: "idle" };

export const Column = ({ list, setLists }: P) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isDraggedOver, setIsDraggedOver] = React.useState(false);
  const [state, setState] = React.useState<CardState>(idle);
  const [isDragging, setIsDragging] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    title: "",
    description: "",
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [editOpen, setEditOpen] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(list.title);
  const [editLoading, setEditLoading] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editError, setEditError] = React.useState("");

  React.useEffect(() => {
    const element = ref.current;
    invariant(element, "Element is missing");
    return combine(
      draggable({
        element,
        getInitialData: () => ({
          list,
          listId: list.id,
        }),
        onDragStart: () => {
          setIsDragging(true);
        },
        onDrop: () => {
          setIsDragging(false);
        },
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) => {
          if (source.data.listId === list.id && source.data.list) {
            // Prevent dropping on the same list
            return false;
          }
          if (source.data.list) {
            return true;
          }
          if (source.data.card) {
            return true;
          }
          return false;
        },
        getIsSticky: () => true,
        getData: ({ input, source }) => {
          return attachClosestEdge(
            { data: { list, listId: list.id } },
            {
              element,
              input,
              allowedEdges: source.data.card
                ? ["top", "bottom"]
                : ["left", "right"],
            }
          );
        },
        onDrag({ self, source }) {
          if (source.data.card) {
            return;
          }
          const closestEdge = extractClosestEdge(self.data);
          // Prevents re-rendering.
          setState((current) => {
            if (
              current.type === "is-dragging-over" &&
              current.closestEdge === closestEdge
            ) {
              return current;
            }
            return { type: "is-dragging-over", closestEdge };
          });
        },

        onDragEnter: ({ source }) => {
          if (source.data.card) setIsDraggedOver(true);
        },
        onDragStart: ({ source }) => {
          if (source.data.card) setIsDraggedOver(true);
        },
        onDragLeave: () => {
          setIsDraggedOver(false);
          setState(idle);
        },
        onDrop: ({ self, source, location }) => {
          setIsDraggedOver(false);
          setState(idle);

          // handle reorder of lists
          if (source.data.list) {
            // Add type guard to check if list has an id property
            if (
              typeof source.data.list !== "object" ||
              !source.data.list ||
              !("id" in source.data.list)
            ) {
              return;
            }
            // Use type guard before accessing self.data.data
            if (!isColumnDropTargetData(self.data)) {
              return;
            }

            const sourceListId = source.data.list.id;
            const targetListId = self.data.data.listId;
            const closestEdge = extractClosestEdge(self.data);

            if (sourceListId === targetListId) return;

            setLists((prevLists) => {
              // Create a deep copy of the lists
              const newLists: List[] = JSON.parse(JSON.stringify(prevLists));

              // Find the source and target lists
              const sourceList = newLists.find(
                (list) => list.id === sourceListId
              );
              const targetList = newLists.find(
                (list) => list.id === targetListId
              );

              if (!sourceList || !targetList) return prevLists;

              // Remove the list from the source list
              newLists.splice(newLists.indexOf(sourceList), 1);

              // Insert the list at the appropriate position based on the edge
              const newPosition =
                closestEdge === "right"
                  ? newLists.indexOf(targetList) + 1
                  : newLists.indexOf(targetList);
              newLists.splice(newPosition, 0, sourceList);

              // Make the api call to update the list's position
              updateColumn(sourceList.id, {
                position: newPosition,
                boardId: targetList.boardId, // Assuming the boardId is the same for both lists
              });

              return newLists;
            });
            return;
          }

          // dont do anything if there are 2 droptargets, Drop operation will be handled by the Card onDrop
          if (location.current.dropTargets.length === 2) return;

          // Add these type checks
          if (!isCardData(source.data)) {
            return;
          }

          if (!isColumnDropTargetData(self.data)) {
            return;
          }

          const sourceCardId = source.data.card.id;
          const sourceListId = source.data.listId;
          const targetListId = self.data.data.listId;
          const closestEdge = extractClosestEdge(self.data);

          // We already have the card object in source.data.card
          const cardToMove = source.data.card;
          const targetListCardsLength = self.data.data.list.tasks.length;

          // call the api to update the card's column
          updateTask(cardToMove.id, {
            columnId: targetListId,
            position: closestEdge === "bottom" ? targetListCardsLength : 0,
          });

          setLists((prevLists) => {
            // Create a deep copy of the lists
            const newLists: List[] = JSON.parse(JSON.stringify(prevLists));

            // Find the source and target lists
            const sourceList = newLists.find(
              (list) => list.id === sourceListId
            );
            const targetList = newLists.find(
              (list) => list.id === targetListId
            );

            if (!sourceList || !targetList) return prevLists;

            // Remove the card from the source list
            sourceList.tasks = sourceList.tasks.filter(
              (card) => card.id !== sourceCardId
            );

            // Insert the card at the appropriate position based on the edge
            if (closestEdge === "bottom") {
              targetList.tasks.push(cardToMove);
            } else {
              targetList.tasks.unshift(cardToMove);
            }

            return newLists;
          });
        },
      })
    );
  }, [list, setLists]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        title: form.title,
        description: form.description,
        columnId: list.id,
        position: list.tasks.length,
      };
      const response = await api.post("/tasks", payload);
      const newCard = response.data;
      setLists((prev) =>
        prev.map((l) =>
          l.id === list.id ? { ...l, tasks: [...l.tasks, newCard] } : l
        )
      );
      setForm({ title: "", description: "" });
      setOpen(false);
    } catch (err) {
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
      ) {
        setError("Failed to add card");
      } else {
        setError("Failed to add card");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Edit column name handler
  const handleEditColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    try {
      await updateColumn(list.id, { title: editTitle });
      setLists((prev) =>
        prev.map((l) => (l.id === list.id ? { ...l, title: editTitle } : l))
      );
      setEditOpen(false);
    } catch {
      setEditError("Failed to update column name");
    } finally {
      setEditLoading(false);
    }
  };

  // Delete column handler
  const handleDeleteColumn = async () => {
    setEditLoading(true);
    try {
      await deleteColumn(list.id);
      setLists((prev) => prev.filter((l) => l.id !== list.id));
      setDeleteDialogOpen(false);
    } catch {
      setEditError("Failed to delete column");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div
      ref={ref}
      className={`m-2 rounded-lg w-80 relative h-fit transition-colors duration-300
        bg-card text-card-foreground shadow-md
        ${isDraggedOver ? "outline-2 outline-primary" : ""}
        ${isDragging ? "opacity-50" : ""}`}
      style={
        isDraggedOver
          ? { backgroundColor: "var(--column-drop-hover)" }
          : undefined
      }
    >
      {/* List header */}
      <div className="p-3 rounded-t-lg flex items-center justify-between">
        <h2 className="font-semibold flex items-center">
          <span className="mr-2">{list.title}</span>
          <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
            {list.tasks.length}
          </span>
        </h2>
        {/* 3 dots menu */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="p-1 rounded hover:bg-muted focus:outline-none">
              <MoreVertical className="w-5 h-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-44 p-0" align="end">
            <div className="py-1">
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
                onClick={() => {
                  setEditTitle(list.title);
                  setEditOpen(true);
                }}
              >
                Edit title
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete column
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {/* Edit column dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit column name</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditColumn} className="space-y-4">
            <div>
              <input
                className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
                autoFocus
              />
            </div>
            {editError && (
              <div className="text-red-500 text-sm">{editError}</div>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={editLoading}>
                {editLoading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete column"
        description="Are you sure you want to delete this column? This action cannot be undone."
        loading={editLoading}
        error={editError}
        onConfirm={handleDeleteColumn}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
      {list.tasks.length === 0 && (
        <div
          className="p-4 mx-3 my-2 border-2 border-dashed rounded-md bg-muted bg-opacity-40"
          style={{ backgroundColor: "var(--color-muted, #f1f5f9)" }}
        >
          <div className="flex flex-col items-center text-center gap-2">
            <p className="text-foreground text-sm font-medium">No cards yet</p>
            <p className="text-muted-foreground text-xs opacity-80">
              Drag cards here or add a new card below
            </p>
          </div>
        </div>
      )}

      {/* Cards container */}
      <div className="p-3">
        {list.tasks.map((card) => (
          <CardComponent
            key={card.id}
            card={card}
            list={list}
            setLists={setLists}
          />
        ))}
      </div>
      {/* Add card button */}
      <div className="p-3 border-t border-border">
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
              Add a card
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new card</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="title"
                >
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
                  {submitting ? "Adding..." : "Add Card"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {state.type === "is-dragging-over" && state.closestEdge ? (
        <DropIndicator edge={state.closestEdge} gap="24px" />
      ) : null}
    </div>
  );
};
