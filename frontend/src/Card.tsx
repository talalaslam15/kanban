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

export const CardComponent = ({ card, list }: { card: Card; list: List }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [state, setState] = React.useState<CardState>(idle);
  console.log("CardComponent", state);

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
          // only allowing tasks to be dropped on me
          return true;
        },
        getData({ input }) {
          const data = element;
          return attachClosestEdge(
            { data },
            {
              element,
              input,
              allowedEdges: ["top", "bottom"],
            }
          );
        },
        getIsSticky() {
          return false;
        },
        // onDragEnter({ self }) {
        //   const closestEdge = extractClosestEdge(self.data);
        //   setState({ type: "is-dragging-over", closestEdge });
        // },
        onDrag({ self }) {
          const closestEdge = extractClosestEdge(self.data);

          // Only need to update react state if nothing has changed.
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
          console.log("leave");
          setState(idle);
        },
        onDrop() {
          console.log("drop");
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
