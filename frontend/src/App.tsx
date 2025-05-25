import { List } from "./types";
import { defaultData } from "./data";
import { Column } from "./Column";
import { useState } from "react";
import { useAuth } from "./auth/AuthContext";
import { useNavigate } from "react-router";

function App() {
  const [lists, setLists] = useState<List[]>(defaultData);
  const { authState, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-gray-950 min-h-screen p-8">
      {/* Header with user info and logout */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-100">My Kanban Board</h1>
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
