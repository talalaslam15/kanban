import api from "@/auth/api";
import { Board } from "../types";

export const getBoards = async (): Promise<Board[]> => {
  const res = await api.get("/boards");
  return res.data;
};

export const getBoardById = async (id: string): Promise<Board> => {
  const res = await api.get(`/boards/${id}`);
  return res.data;
};

export const createBoard = async (data: Partial<Board>): Promise<Board> => {
  const res = await api.post("/boards", data);
  return res.data;
};

export const updateBoard = async (
  id: string,
  data: Partial<Board>
): Promise<Board> => {
  const res = await api.patch(`/boards/${id}`, data);
  return res.data;
};

export const deleteBoard = async (id: string): Promise<void> => {
  await api.delete(`/boards/${id}`);
};
