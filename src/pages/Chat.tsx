import { useLoaderData } from "react-router-dom";
import type { LoaderData } from "../types/LoaderData.type";
import { useEffect, useState } from "react";
import type { Message } from "../models/Message.model";
import { http } from "../utils/authFetch";
import type { User } from "../models/User.model";

export default function Chat() {
  const data: LoaderData = useLoaderData();
  // const [uncontactedUsers, setUncontactedUser] = useState<User[]>([]);
  const [currentConvId, setCurrentConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]); // Replace 'any' with your Message type
  const [loading, setLoading] = useState(false);

  // Fetch messages whenever currentConvId changes
  useEffect(() => {
    if (!currentConvId) return;
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const messages = await http().get<Message[]>(
          `/message/conversation/${currentConvId}`
        );
        setMessages(messages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [currentConvId]);

  /**
   * create a conversation then switch current conv to it
   * @param userId
   * @returns
   */
  const createConversationWith = (userId: number) => {
    return userId;
  };

  /**
   * Set currentConv to passed convId
   * @param convId
   */
  const switchToConv = (convId: number) => {};

  return (
    <div className="chat-container">
      <nav>
        <h1>Chat</h1>
        <ul>
          {data.uncontactedUsers.map((user) => (
            <li key={user.id}>
              <button onClick={() => createConversationWith(user.id)}>
                {user.username}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <main>
        {loading && <p>Loading messages...</p>}
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.authorId}:</strong> {msg.content}
          </div>
        ))}
      </main>
    </div>
  );
}
