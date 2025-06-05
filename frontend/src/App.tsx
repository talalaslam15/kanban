import { Board, List } from "./types";
import { Column } from "./Column";
import { useState, useEffect } from "react";
import { useAuth } from "./auth/AuthContext";
import { AddColumn } from "./AddColumn";
import { getBoards } from "./api/boards.api";
import { Header } from "./Header";

function App() {
  const { authState } = useAuth();
  const [lists, setLists] = useState<List[]>([]);
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBoards = async (boardId?: string) => {
    setLoading(true);
    try {
      const response = await getBoards();
      let selected = response?.[0] || null;
      if (boardId) {
        const found = response.find((b) => b.id === boardId);
        if (found) selected = found;
      }
      setBoard(selected);
      setLists(selected?.columns || []);
    } catch {
      // setLists([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchBoards();
    }
  }, [authState.isAuthenticated]);

  const handleBoardChange = (b: Board) => {
    setBoard(b);
    setLists(b.columns || []);
  };

  if (authState.loading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <span className="text-gray-200 text-xl">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-muted text-foreground transition-colors duration-300">
      <Header board={board} onBoardChange={handleBoardChange} />
      <h1 className="text-3xl font-bold">{board?.title || ""}</h1>
      <div
        className="pl-2 flex gap-2 overflow-x-auto flex-nowrap scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent"
        style={{
          WebkitOverflowScrolling: "touch",
          minHeight: "calc(100vh - 160px)",
        }}
      >
        {lists.map((list) => (
          <Column key={list.id} list={list} setLists={setLists} />
        ))}
        {board && (
          <AddColumn
            boardId={board.id}
            position={lists.length}
            onAddColumn={() => fetchBoards(board.id)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
