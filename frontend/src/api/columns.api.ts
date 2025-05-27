import api from "@/auth/api";
import { List } from "../types";

export const getColumns = async (): Promise<List[]> => {
  const res = await api.get("/columns");
  return res.data;
};

export const getColumnById = async (id: string): Promise<List> => {
  const res = await api.get(`/columns/${id}`);
  return res.data;
};

export const createColumn = async (data: Partial<List>): Promise<List> => {
  const res = await api.post("/columns", data);
  return res.data;
};

export const updateColumn = async (
  id: string,
  data: Partial<List>
): Promise<List> => {
  const res = await api.patch(`/columns/${id}`, data);
  return res.data;
};

export const deleteColumn = async (id: string): Promise<void> => {
  await api.delete(`/columns/${id}`);
};
