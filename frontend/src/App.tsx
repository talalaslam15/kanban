import { List } from "./types";
import { defaultData } from "./data";
import { Column } from "./Column";
import { useState } from "react";

function App() {
  const [lists, setLists] = useState<List[]>(defaultData);
  return (
    <div className="bg-gray-950 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-100 mb-4">My Kanban Board</h1>

      <div className="pl-2 flex gap-2 overflow-x-auto pb-4">
        {lists.map((list) => (
          <Column key={list.id} list={list} setLists={setLists} />
        ))}
      </div>
    </div>
  );
}

export default App;
