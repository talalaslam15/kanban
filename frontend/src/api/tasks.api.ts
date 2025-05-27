import api from "@/auth/api";
import { Card } from "../types";

export const getTasks = async (): Promise<Card[]> => {
  const res = await api.get("/tasks");
  return res.data;
};

export const getTaskById = async (id: string): Promise<Card> => {
  const res = await api.get(`/tasks/${id}`);
  return res.data;
};

export const createTask = async (data: Partial<Card>): Promise<Card> => {
  const res = await api.post("/tasks", data);
  return res.data;
};

export const updateTask = async (
  id: string,
  data: Partial<Card>
): Promise<Card> => {
  const res = await api.patch(`/tasks/${id}`, data);
  return res.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};
