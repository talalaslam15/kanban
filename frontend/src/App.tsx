import { Column } from "./Column";
import { useAuth } from "./auth/AuthContext";
import { AddColumn } from "./AddColumn";
import { Header } from "./Header";
import { useGetBoards } from "./features/boards/hooks/useGetBoards";
import React, { useState } from "react";
import { List } from "./types";

function App() {
  const { authState } = useAuth();
  const { data: boards, isFetching: loading, refetch } = useGetBoards();
  const [lists, setLists] = useState<List[]>([]);
  // Track selected board ID in state
  const [selectedBoardId, setSelectedBoardId] = useState<string | undefined>(
    undefined
  );
  // Find the selected board from the fetched boards
  const board = boards?.find((b) => b.id === selectedBoardId) || boards?.[0];
  // const lists = board?.columns || [];

  // Handler for board change
  const handleBoardChange = (b: { id: string }) => {
    setSelectedBoardId(b.id);
  };

  React.useEffect(() => {
    if (board) {
      setLists(board?.columns || []); // sync query data into local state
    }
  }, [board]);

  if (authState.loading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <span className="text-gray-200 text-xl">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-muted text-foreground transition-colors duration-300">
      <Header
        boards={boards || []}
        onBoardChange={handleBoardChange}
        onAddBoard={() => refetch()}
        currentBoard={board}
      />
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
            onAddColumn={() => refetch()}
          />
        )}
      </div>
    </div>
  );
}

export default App;
