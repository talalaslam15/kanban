import React from "react";
import type { Card, List } from "./types";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  attachClosestEdge,
  type Edge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import invariant from "tiny-invariant";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";

const idle: CardState = { type: "idle" };
type CardState =
  | {
      type: "idle";
    }
  | {
      type: "preview";
      container: HTMLElement;
    }
  | {
      type: "is-dragging";
    }
  | {
      type: "is-dragging-over";
      closestEdge: Edge | null;
    };

type CardProps = {
  card: Card;
  list: List;
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
};

export const CardComponent = ({ card, list, setLists }: CardProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [state, setState] = React.useState<CardState>(idle);

  React.useEffect(() => {
    const element = ref.current;
    invariant(element, "Element is missing");
    return combine(
      draggable({
        element,
        getInitialData: () => ({
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
          if (source.element === element) {
            return false;
          }
          // not allowing dropping lists on cards
          if (source.data.list) {
            return false;
          }
          // only allowing tasks to be dropped on me
          return true;
        },
        getData({ input }) {
          // const data = element;
          return attachClosestEdge(
            { data: { card, list } },
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
          const sourceCardId = source.data.card.id;
          const sourceListId = source.data.listId;
          const targetCard = self.data.data.card.id;
          const targetListId = self.data.data.list.id;
          const closestEdge = extractClosestEdge(self.data);

          setLists((prevLists) => {
            // Create a deep copy of the lists
            const newLists = JSON.parse(JSON.stringify(prevLists));

            // Find the source and target lists
            const sourceList = newLists.find(
              (list) => list.id === sourceListId
            );
            const targetList = newLists.find(
              (list) => list.id === targetListId
            );

            if (!sourceList || !targetList) return prevLists;

            // Find the card to move
            const cardToMove = sourceList.cards.find(
              (card) => card.id === sourceCardId
            );
            if (!cardToMove) return prevLists;

            // Remove the card from the source list
            sourceList.cards = sourceList.cards.filter(
              (card) => card.id !== sourceCardId
            );

            // Find the position of the target card in the target list
            const targetCardIndex = targetList.cards.findIndex(
              (card) => card.id === targetCard
            );

            // Insert the card at the appropriate position based on the edge
            if (closestEdge === "bottom") {
              targetList.cards.splice(targetCardIndex + 1, 0, cardToMove);
            } else {
              targetList.cards.splice(targetCardIndex, 0, cardToMove);
            }

            return newLists;
          });

          setState(idle);
        },
      })
    );
  }, [card, list.id]);
  return (
    <div className="relative">
      <div
        ref={ref}
        className={`border-b-gray-900 bg-blue-950 rounded-lg p-3 mb-3 shadow cursor-grab hover:shadow-md transition-shadow duration-200 ${
          isDragging ? "opacity-50" : ""
        }`}
      >
        <h3 className="font-medium text-gray-200 mb-2">{card.title}</h3>
        <p className="text-gray-400 text-sm">{card.description}</p>

        {/* Card footer with labels/actions */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          </div>
        </div>
      </div>
      {state.type === "is-dragging-over" && state.closestEdge ? (
        <DropIndicator edge={state.closestEdge} gap="12px" />
      ) : null}
    </div>
  );
};
