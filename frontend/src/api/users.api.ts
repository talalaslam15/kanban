import api from "@/auth/api";
import { User } from "../types";

export const getUserById = async (id: string): Promise<User> => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const updateUser = async (
  id: string,
  data: Partial<{ name: string; email: string; password: string }>
): Promise<User> => {
  const res = await api.patch(`/users/${id}`, data);
  return res.data;
};
