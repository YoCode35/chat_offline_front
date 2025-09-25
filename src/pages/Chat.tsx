import { useLoaderData } from "react-router-dom";
import type { LoaderData } from "../types/LoaderData.type";
import { useEffect, useState } from "react";
import type { Message } from "../models/Message.model";
import { http } from "../utils/authFetch";
import type { Conversation } from "../models/Conversation.model";

// Import du CSS pour le chat
import "../css/Chat.css";

export default function Chat() {
  // Récupération des données passées par le loader de React Router
  const data: LoaderData = useLoaderData();

  // État pour l'ID de la conversation courante
  const [currentConvId, setCurrentConvId] = useState<number | null>(null);

  // État pour stocker les messages de la conversation courante
  const [messages, setMessages] = useState<Message[]>([]);

  // État pour gérer l'affichage du loader
  const [loading, setLoading] = useState(false);

  // État pour stocker la conversation complète courante
  const [conversations, setConversations] = useState<Conversation[] | null>(null);

  // -------------------------------
  // Fetch des messages et de la conversations
  // à chaque fois que currentConvId change
  // -------------------------------
  useEffect(() => {
    if (!currentConvId) return; // Si aucune conversation sélectionnée, on ne fait rien

    const fetchMessages = async () => {
      setLoading(true); // Début du chargement
      try {
        // On récupère en parallèle les messages et la conversation complète
        const msgs = await http().get<Message[]>(`/message/conversation/${currentConvId}`);

        setMessages(msgs);        // Mise à jour des messages
      } catch (err) {
        console.error(err);       // Gestion d'erreur simple
      } finally {
        setLoading(false);        // Fin du chargement
      }
    };

    fetchMessages();
  }, [currentConvId]);

  const actualiseConversations = async () => {
    const convs = await http().get<Conversation[]>("/conversation/my-conversations");
    setConversations(convs);
  }
  /**
   * Demande au serveur de créer une nouvelle conversation avec l'utilisateur donné
   * @param userId L'ID de l'utilisateur avec qui démarrer la conversation
   */
  const createConversationWith = async (userId: number) => {
    const newConv = await http().post<Conversation>("/conversation", { userId });
    await actualiseConversations();
    setCurrentConvId(newConv.id);

  };
  
  actualiseConversations();


  // -------------------------------
  // Rendu du composant
  // -------------------------------
  return (
    <div className="chat-container">
      {/* Header du chat */}
      <header className="chat-header">
        <h1 className="chat-title">Chat</h1>
      </header>

      {/* Navigation : liste des utilisateurs non contactés */}
      <nav>
        
        <ul>
          {data.uncontactedUsers.map((user) => (
            <li key={user.id} className="user-item">
              <button
                className="user-btn"
                data-tooltip={`Envoyer un message à ${user.username}`}
                onClick={() => createConversationWith(user.id)}
              >
                {/* Cercle de statut */}
                <span className={`status-indicator ${user.status ?? "offline"}`}></span>
                {user.username}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <main>
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.authorId}:</strong> {msg.content}
          </div>
        ))}
      </main>
    </div>
  );
}
