import React from "react";
import type { Card, CardState, List } from "./types";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import invariant from "tiny-invariant";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import { deleteTask, updateTask } from "./api/tasks.api";
import { Button } from "./components/ui/button";
import { Trash2 } from "lucide-react";
import { CardDialog } from "./CardDialog";
import { Badge } from "./components/ui/badge";

const privateCardSymbol = Symbol("Card");

type DragCardData = {
  [privateCardSymbol]: true;
  card: Card;
  listId: string;
};

function getCardData(
  data: Omit<DragCardData, typeof privateCardSymbol>
): DragCardData {
  return {
    [privateCardSymbol]: true,
    ...data,
  };
}

function isCardData(data: unknown): data is DragCardData {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as Record<string | symbol, unknown>)[privateCardSymbol] === true
  );
}

// Add this type definition after your other type definitions
type CardDropTargetData = {
  data: {
    card: Card;
    list: List;
    listId: string;
  };
};

// Add this type guard function with your other type guards
function isCardDropTargetData(data: unknown): data is CardDropTargetData {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const candidate = data as Record<string, unknown>;

  if (typeof candidate.data !== "object" || candidate.data === null) {
    return false;
  }

  const nestedData = candidate.data as Record<string, unknown>;

  return (
    typeof nestedData.card === "object" &&
    nestedData.card !== null &&
    typeof nestedData.list === "object" &&
    nestedData.list !== null &&
    typeof nestedData.listId === "string"
  );
}
const idle: CardState = { type: "idle" };
type CardProps = {
  card: Card;
  list: List;
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
};

export const CardComponent = ({ card, list, setLists }: CardProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [state, setState] = React.useState<CardState>(idle);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const element = ref.current;
    invariant(element, "Element is missing");
    return combine(
      draggable({
        element,
        getInitialData: () =>
          getCardData({
            card,
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
        canDrop({ source }) {
          // not allowing dropping on yourself
          // if (source.element === element) {
          //   return false;
          // }
          // not allowing dropping lists on cards
          if (source.data.list) {
            return false;
          }
          // only allowing tasks to be dropped on me
          return true;
        },
        getData({ input, element, source }) {
          // const data = element;
          if (source.element === element) {
            return { data: { card, list, listId: list.id } };
          }
          return attachClosestEdge(
            { data: { card, list, listId: list.id } },
            {
              element,
              input,
              allowedEdges: ["top", "bottom"],
            }
          );
        },
        getIsSticky() {
          return true;
        },
        onDrag({ self }) {
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
        onDragLeave() {
          setState(idle);
        },
        onDrop({ self, source }) {
          setState(idle);
          if (!isCardData(source.data)) {
            return;
          }

          if (!isCardDropTargetData(self.data)) {
            return;
          }

          const sourceCardId = source.data.card.id;
          const sourceListId = source.data.listId;
          const targetCard = self.data.data.card.id;
          const targetListId = self.data.data.list.id;
          const closestEdge = extractClosestEdge(self.data);

          if (sourceCardId === targetCard) {
            return;
          }

          // updateTask(sourceCardId, {
          //   columnId: targetListId,
          //   position: self.data.data.card.position,
          // }).catch((error) => {
          //   console.error("Failed to update task position:", error);
          // });

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

            // Find the card to move
            const cardToMove = sourceList.tasks.find(
              (card) => card.id === sourceCardId
            );
            if (!cardToMove) return prevLists;

            // Remove the card from the source list
            sourceList.tasks = sourceList.tasks.filter(
              (card) => card.id !== sourceCardId
            );

            // Find the position of the target card in the target list
            const targetCardIndex = targetList.tasks.findIndex(
              (card) => card.id === targetCard
            );

            // // Insert the card at the appropriate position based on the edge
            const newPosition =
              closestEdge === "bottom" ? targetCardIndex + 1 : targetCardIndex;

            targetList.tasks.splice(newPosition, 0, cardToMove);
            // Call the API to update the task position
            updateTask(sourceCardId, {
              columnId: targetListId,
              position: newPosition,
            }).catch((error) => {
              console.error("Failed to update task position:", error);
            });
            return newLists;
          });
        },
      })
    );
  }, [card, list, list.id, setLists]);

  const handleDeleteCard = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent the click from triggering the drag event
    // Call the API to delete the card
    deleteTask(card.id).catch((error) => {
      console.error("Failed to delete task:", error);
    });
    setLists((prevLists) =>
      prevLists.map((l) => ({
        ...l,
        tasks: l.tasks.filter((t) => t.id !== card.id),
      }))
    );
  };

  const handleEditCard = async (values: {
    title: string;
    description: string;
  }) => {
    setIsSubmitting(true);
    setError("");
    try {
      // Call API to update the card
      await updateTask(card.id, {
        title: values.title,
        description: values.description,
      });

      // Update local state
      setLists((prevLists) =>
        prevLists.map((l) => ({
          ...l,
          tasks: l.tasks.map((t) =>
            t.id === card.id
              ? { ...t, title: values.title, description: values.description }
              : t
          ),
        }))
      );
      setEditDialogOpen(false);
    } catch (err) {
      setError("Failed to update card");
      console.error("Failed to update card:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCardClick = () => {
    setEditDialogOpen(true);
  };

  const getVariant = (priority: Card["priority"]) => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "warning";
      case "medium":
        return "secondary";
      case "low":
        return "success";
      default:
        return "outline";
    }
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        onClick={handleCardClick}
        className={`group bg-card text-card-foreground border border-border rounded-lg p-3 mb-3 shadow cursor-grab hover:shadow-md transition-colors duration-300
          ${isDragging ? "opacity-50" : ""}`}
      >
        <div className="flex justify-between items-start">
          <h3 className="font-medium mb-2 text-foreground">{card.title}</h3>{" "}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-warning cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleDeleteCard}
          >
            <Trash2 className="h-4 w-4 text-red-400 hover:text-warning transition-colors" />
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">{card.description}</p>
        {/* Card footer with labels/actions */}
        <div>
          <Badge variant={getVariant(card.priority)}>{card.priority}</Badge>
        </div>
      </div>
      {/* Drop indicator for dragging over */}
      {state.type === "is-dragging-over" && state.closestEdge ? (
        <DropIndicator edge={state.closestEdge} gap="12px" />
      ) : null}
      {/* Edit Card Dialog */}
      <CardDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        initialValues={card}
        onSubmit={handleEditCard}
        title="Edit Card"
        submitLabel="Save Changes"
        isSubmitting={isSubmitting}
        error={error}
      />
    </div>
  );
};
