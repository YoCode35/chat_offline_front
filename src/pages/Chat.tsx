import { useLoaderData } from "react-router-dom";
import type { LoaderData } from "../types/LoaderData.type";

export default function Chat() {
  const data: LoaderData = useLoaderData(); // If your loader returns something
  return (
    <div>
      <h1>Chat</h1>
      <ul>
        {data.uncontactedUsers.map((user) => (
          <li key={user.id}>{user.username}</li> //Faire un composant
        ))}
      </ul>
    </div>
  );
}
