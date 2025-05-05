import React from "react";
import { type List } from "./types";
import {
  draggable,
  dropTargetForElements,
  // monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { CardComponent } from "./Card";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

type P = {
  list: List;
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
};

export const Column = ({ list, setLists }: P) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isDraggedOver, setIsDraggedOver] = React.useState(false);

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
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) => {
          if (source.data.list) {
            return false;
          }
          if (source.data.card) {
            return true;
          }
          return false;
        },
        getData: ({ input }) => {
          return attachClosestEdge(
            { data: { list, listId: list.id } },
            {
              element,
              input,
              allowedEdges: ["top", "bottom"],
            }
          );
        },
        onDragEnter: () => {
          setIsDraggedOver(true);
        },
        onDragStart: () => {
          setIsDraggedOver(true);
        },
        onDragLeave: () => {
          setIsDraggedOver(false);
        },
        onDrop: ({ self, source }) => {
          setIsDraggedOver(false);

          console.log("source", source);
          console.log("self", self);

          const sourceCardId = source.data.card.id;
          const sourceListId = source.data.listId;
          const targetListId = self.data.data.listId;
          const closestEdge = extractClosestEdge(self.data);

          // We already have the card object in source.data.card
          const cardToMove = source.data.card;

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
            sourceList.cards = sourceList.cards.filter(
              (card) => card.id !== sourceCardId
            );

            // Insert the card at the appropriate position based on the edge
            if (closestEdge === "bottom") {
              targetList.cards.push(cardToMove);
            } else {
              targetList.cards.unshift(cardToMove);
            }

            return newLists;
          });
        },
      })
    );
  }, [list, setLists]);

  // React.useEffect(() => {
  //   const element = ref.current;
  //   invariant(element, "Element is missing");
  //   const monitorConfig = {
  //     element,
  //     onDrag: ({ location }) => {
  //       const target = location.current.dropTargets[0];
  //       // console.log("target", target);

  //       if (!target) {
  //         return;
  //       }
  //       if (target.data.columnId === list.id) {
  //         setIsDraggedOver(true);
  //       } else {
  //         setIsDraggedOver(false);
  //       }
  //     },
  //     onDrop() {
  //       setIsDraggedOver(false);
  //     },
  //   };
  //   return monitorForElements(monitorConfig);
  // }, [list.id]);

  return (
    <div
      ref={ref}
      className={`m-2 bg-cyan-900 rounded-lg w-80 flex-shrink-0 flex flex-col ${
        isDraggedOver ? "outline-2 outline-blue-500 bg-teal-900" : ""
      }`}
    >
      {/* List header */}
      <div className="p-3 bg-blue-900-300 rounded-t-lg">
        <h2 className="font-semibold text-gray-100 flex items-center">
          <span className="mr-2">{list.title}</span>
          <span className="bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 text-xs">
            {list.cards.length}
          </span>
        </h2>
      </div>

      {/* Cards container */}
      <div className="p-3 flex-grow overflow-y-auto ">
        {list.cards.map((card) => (
          <CardComponent
            key={card.id}
            card={card}
            list={list}
            setLists={setLists}
          />
        ))}
      </div>

      {/* Add card button */}
      <div className="p-3 border-t border-gray-300">
        <button className="w-full py-1.5 bg-gray-50 text-gray-500 text-sm hover:bg-gray-300 rounded flex items-center justify-center transition-colors duration-200">
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
      </div>
    </div>
  );
};
