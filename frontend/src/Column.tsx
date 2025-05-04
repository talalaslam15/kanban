import React from "react";
import { type List } from "./types";
import {
  draggable,
  // dropTargetForElements,
  // monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { CardComponent } from "./Card";

export const Column = ({ list, setLists }: { list: List; setLists: any }) => {
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
      })
      // dropTargetForElements({
      //   element,
      //   getData: () => ({ list }),
      //   onDragEnter: () => {
      //     setIsDraggedOver(true);
      //   },
      //   onDragStart: () => {
      //     setIsDraggedOver(true);
      //   },
      //   onDragLeave: () => {
      //     setIsDraggedOver(false);
      //   },

      //   onDrop: ({ location, self, source }: any) => {
      //     const card = source.data.card.id;
      //     setIsDraggedOver(false);
      //     console.log("location", location);
      //     console.log("self", self);
      //     console.log("source", source);
      //     console.log("card", card);
      //   },
      // })
    );
  }, []);

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
      <div className="p-3 flex-grow overflow-y-auto max-h-[calc(100vh-200px)]">
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
