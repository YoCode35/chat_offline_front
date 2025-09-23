import { useState } from "react";
import "../WebSocketChat.css"

// Type pour définir un utilisateur
interface User {
  id: string;
  username: string;
  status: "online" | "away" | "offline";
  avatar?: string;
  lastSeen?: string;
}

// Type pour définir une conversation
interface Conversation {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

// Mock hook pour simuler useWebSocket
const useWebSocket = () => {
  const [messages] = useState([
    "Salut tout le monde ! 👋",
    "Comment ça va ?",
    "Super, et toi ?",
    "Ça roule ! 🚀",
    "Qui travaille sur le projet aujourd'hui ?"
  ]);
  
  const sendMessage = (message: string) => {
    console.log("Envoi du message:", message);
  };
  
  return {
    messages,
    sendMessage,
    isConnected: true
  };
};

export default function WebSocketChat() {
  const { messages, sendMessage, isConnected } = useWebSocket();
  const [input, setInput] = useState("");
  const [activeConversationId, setActiveConversationId] = useState("general");
  const [showUsers, setShowUsers] = useState(true);

  const [conversations] = useState<Conversation[]>([
    {
      id: "general",
      name: "Général",
      lastMessage: "Salut tout le monde !",
      lastMessageTime: "14:32",
      unreadCount: 3
    },
    {
      id: "dev",
      name: "Développement",
      lastMessage: "Le bug a été corrigé",
      lastMessageTime: "13:45",
      unreadCount: 0
    },
    {
      id: "random",
      name: "Random",
      lastMessage: "😂😂😂",
      lastMessageTime: "12:18",
      unreadCount: 1
    },
    {
      id: "support",
      name: "Support",
      lastMessage: "Merci pour votre aide",
      lastMessageTime: "11:30",
      unreadCount: 0
    },
    {
      id: "annonces",
      name: "Annonces",
      lastMessage: "Nouvelle version disponible",
      lastMessageTime: "10:15",
      unreadCount: 2
    }
  ]);

  // Liste des utilisateurs connectés
  const [users] = useState<User[]>([
    {
      id: "1",
      username: "Alice Martin",
      status: "online",
      avatar: "👩‍💻"
    },
    {
      id: "2",
      username: "Bob Dupont",
      status: "online",
      avatar: "👨‍🚀"
    },
    {
      id: "3",
      username: "Claire Dubois",
      status: "away",
      avatar: "👩‍🎨",
      lastSeen: "il y a 5 min"
    },
    {
      id: "4",
      username: "David Leroy",
      status: "online",
      avatar: "👨‍💼"
    },
    {
      id: "5",
      username: "Emma Bernard",
      status: "offline",
      avatar: "👩‍🔬",
      lastSeen: "il y a 2h"
    },
    {
      id: "6",
      username: "François Moreau",
      status: "away",
      avatar: "👨‍🎓",
      lastSeen: "il y a 15 min"
    }
  ]);

  const handleSend = () => {
    if (!isConnected) {
      alert("Connexion WebSocket non établie");
      return;
    }
    
    if (input.trim() !== "") {
      sendMessage(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!isConnected) {
        alert("Connexion WebSocket non établie");
        return;
      }
      handleSend();
    }
  };

  const handleConversationChange = (conversationId: string) => {
    setActiveConversationId(conversationId);
  };

  const activeConversation = conversations.find(conv => conv.id === activeConversationId);

  // Fonction pour obtenir le texte du statut
  const getStatusText = (user: User) => {
    switch (user.status) {
      case "online": return "En ligne";
      case "away": return user.lastSeen || "Absent";
      case "offline": return user.lastSeen || "Hors ligne";
      default: return "Inconnu";
    }
  };

  // Compter les utilisateurs par statut
  const onlineUsers = users.filter(user => user.status === "online").length;
  const totalUsers = users.length;

  return (
    <div className="home">
      <div className="websocket-chat">
        
        {/* Panel de gauche - Liste des conversations */}
        <div className="conversations-panel">
          <div className="conversations-header">
            💬 Conversations
          </div>

          <div className="conversations-list">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleConversationChange(conversation.id)}
                className={`conversation-item ${conversation.id === activeConversationId ? 'active' : ''}`}
              >
                <div className="conversation-content">
                  <div className={`conversation-name ${conversation.unreadCount && conversation.unreadCount > 0 ? 'unread' : ''}`}>
                    {conversation.name}
                  </div>
                  {conversation.lastMessage && (
                    <div className="conversation-last-message">
                      {conversation.lastMessage}
                    </div>
                  )}
                </div>
                <div className="conversation-meta">
                  {conversation.lastMessageTime}
                  {conversation.unreadCount && conversation.unreadCount > 0 && (
                    <div className="unread-badge">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel central - Chat actuel */}
        <div className="chat-panel">
          <div className="chat-header">
            <h3 className="chat-title">
              {activeConversation?.name || "Chat"}
            </h3>
            <div className="chat-controls">
              <button
                onClick={() => setShowUsers(!showUsers)}
                className={`toggle-users-btn ${showUsers ? 'active' : 'inactive'}`}
              >
                👥 Utilisateurs
              </button>
              <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
                {isConnected ? "🟢 Connecté" : "🔴 Déconnecté"}
              </div>
            </div>
          </div>

          <div className="messages-area">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`message-bubble ${idx % 2 === 0 ? 'left' : 'right'}`}
              >
                {msg}
              </div>
            ))}
          </div>

          <div className="message-input-area">
            <input
              className={`message-input ${!isConnected ? 'disconnected' : ''}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={!isConnected ? "Connexion en cours..." : "Tapez votre message..."}
            />

            <button 
              onClick={handleSend}
              disabled={!isConnected || input.trim() === ""}
              className={`send-button ${isConnected && input.trim() !== "" ? 'active' : 'disabled'}`}
            >
              Envoyer
            </button>
          </div>
        </div>

        {/* Panel de droite - Liste des utilisateurs */}
        {showUsers && (
          <div className="users-panel">
            <div className="users-header">
              <div className="users-title">
                👥 Utilisateurs
              </div>
              <div className="users-count">
                {onlineUsers}/{totalUsers} en ligne
              </div>
            </div>

            <div className="users-list">
              {users
                .sort((a, b) => {
                  // Tri par statut : online > away > offline
                  const statusOrder = { "online": 0, "away": 1, "offline": 2 };
                  return statusOrder[a.status] - statusOrder[b.status];
                })
                .map((user) => (
                  <div key={user.id} className="user-item">
                    <div className="user-avatar-container">
                      <div className="user-avatar">
                        {user.avatar}
                      </div>
                      <div className={`status-indicator ${user.status}`} />
                    </div>

                    <div className="user-info">
                      <div className={`username ${user.status}`}>
                        {user.username}
                      </div>
                      <div className={`user-status-text ${user.status}`}>
                        {getStatusText(user)}
                      </div>
                    </div>

                    {user.status === "online" && (
                      <div className="pulse-indicator" />
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}