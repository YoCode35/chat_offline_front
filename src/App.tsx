import React, { useEffect, useState } from "react";

type User = {
  id: number;
  pseudo: string;
};

function App() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/users.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("Utilisateurs :", data);
        setUsers(data);
      });
  }, []);

  return (
    <div>
      <h1>Bienvenue dans le chat offline 🚀</h1>
      <h2>Utilisateurs</h2>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.pseudo}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
