import { Board, List } from "./types";
import { Column } from "./Column";
import { useState, useEffect } from "react";
import { useAuth } from "./auth/AuthContext";
import { useNavigate } from "react-router";
import api from "./auth/api";

function App() {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  const [lists, setLists] = useState<List[]>([]);
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  console.log("board", board);

  useEffect(() => {
    const fetchBoards = async () => {
      setLoading(true);
      try {
        const response = await api.get<Board[]>("/boards");
        setBoard(response.data?.[0]);
        setLists(response.data?.[0].columns || []);
      } catch {
        // setLists([]);
      } finally {
        setLoading(false);
      }
    };
    if (authState.isAuthenticated) {
      fetchBoards();
    }
  }, [authState.isAuthenticated]);

  if (authState.loading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <span className="text-gray-200 text-xl">Loading...</span>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-gray-950 min-h-screen p-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-100">
          {board?.title || ""}
        </h1>
        {authState.isAuthenticated && authState.user && (
          <div className="flex items-center gap-4">
            <span className="text-gray-200 font-medium">
              {authState.user.name || authState.user.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      <div className="pl-2 flex gap-2 overflow-x-auto ">
        {lists.map((list) => (
          <Column key={list.id} list={list} setLists={setLists} />
        ))}
      </div>
    </div>
  );
}

export default App;
