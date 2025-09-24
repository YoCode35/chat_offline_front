export async function chatLoader() {
    const myConversations = await fetch("http://localhost:3000/conversation/my-conversations", {
    method: "GET",
    headers: {Authorization: `${localStorage.getItem("token")}`}
    });
    const uncontactedUsers = await fetch("http://localhost:3000/conversation/uncontacted-users", {
        method: "GET",
        headers: {Authorization: `${localStorage.getItem("token")}`}
    });
    return {myConversations, uncontactedUsers};
}