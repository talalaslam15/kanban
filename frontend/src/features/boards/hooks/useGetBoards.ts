import { useQuery } from "@tanstack/react-query";
import { getBoards } from "../boards.api";
import { Board } from "@/types";
import { useAuth } from "@/auth/AuthContext";

export const useGetBoards = () => {
  const { authState } = useAuth();

  return useQuery<Board[]>({
    queryKey: ["boards"],
    queryFn: getBoards,
    enabled: authState.isAuthenticated,
  });
};
