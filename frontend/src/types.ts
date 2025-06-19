import { type Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

export interface User {
  id: string;
  name: string;
  email: string;
}
export interface Board {
  id: string;
  title: string;
  ownerId: string;
  owner: User;
  columns: List[];
}

export interface List {
  boardId: string;
  position: number;
  id: string;
  title: string;
  tasks: Card[];
}

export interface Card {
  id: string;
  title: string;
  description: string;
  position: number;
  columnId: string;
  dueDate?: Date | null;
  priority: TaskPriority;
  assigneeId?: string | null;
}

export type CardState =
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

type TaskPriority = "low" | "medium" | "high" | "urgent";
