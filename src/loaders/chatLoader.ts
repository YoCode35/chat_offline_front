import type { LoaderData } from "../types/LoaderData.type";

export async function chatLoader(): Promise<LoaderData> {
  const myConversationsResponse = await fetch(
    "http://localhost:3000/conversation/my-conversations",
    {
      method: "GET",
      headers: { Authorization: `${localStorage.getItem("token")}` },
    }
  );
  const uncontactedUsersResponse = await fetch(
    "http://localhost:3000/conversation/uncontacted-users",
    {
      method: "GET",
      headers: { Authorization: `${localStorage.getItem("token")}` },
    }
  );
  const myConversations = await myConversationsResponse.json();
  const uncontactedUsers = await uncontactedUsersResponse.json();

  return { myConversations, uncontactedUsers };
}
