// On importe useState pour gérer l'état local du champ de saisie
import { useState } from "react";

// On importe notre hook personnalisé useWebSocket pour gérer la connexion WebSocket
import { useWebSocket } from "../hooks/useWebSocket";

// Type pour définir une conversation
interface Conversation {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

// Définition du composant WebSocketChat
export default function WebSocketChat() {
  // On utilise le hook useWebSocket avec l'URL du serveur WebSocket
  const { messages, sendMessage, isConnected } = useWebSocket("ws://localhost:8080");

  // État local pour stocker le texte tapé par l'utilisateur dans l'input
  const [input, setInput] = useState("");

  // État pour gérer la conversation active
  const [activeConversationId, setActiveConversationId] = useState("general");

  // Liste des conversations (vous pourrez la charger depuis une API plus tard)
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

  // Fonction appelée quand l'utilisateur clique sur "Envoyer"
  const handleSend = () => {
    // On vérifie que la connexion est active avant d'envoyer
    if (!isConnected) {
      alert("Connexion WebSocket non établie");
      return;
    }
    
    // On ignore les messages vides ou contenant seulement des espaces
    if (input.trim() !== "") {
      sendMessage(input); // On envoie le message au WebSocket
      setInput("");       // On vide le champ de saisie
    }
  };

  // Fonction pour gérer l'appui sur Entrée dans l'input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!isConnected) {
        alert("Connexion WebSocket non établie");
        return;
      }
      handleSend();
    }
  };

  // Fonction pour changer de conversation
  const handleConversationChange = (conversationId: string) => {
    setActiveConversationId(conversationId);
    // Ici vous pourriez charger les messages de cette conversation
  };

  // Trouver la conversation active
  const activeConversation = conversations.find(conv => conv.id === activeConversationId);

  // JSX rendu par le composant
  return (
    <div className="home">
      <div style={{ 
        maxWidth: "1000px", 
        width: "100%", 
        height: "80vh",
        display: "flex",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "white",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        overflow: "hidden"
      }}>
        
        {/* Panel de gauche - Liste des conversations */}
        <div style={{
          width: "300px",
          borderRight: "1px solid #ccc",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f8f9fa"
        }}>
          {/* En-tête du panel conversations */}
          <div style={{
            padding: "1rem",
            borderBottom: "1px solid #ccc",
            backgroundColor: "#fff",
            fontWeight: "bold",
            fontSize: "1.1rem"
          }}>
            💬 Conversations
          </div>

          {/* Liste des conversations */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleConversationChange(conversation.id)}
                style={{
                  padding: "1rem",
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                  backgroundColor: conversation.id === activeConversationId ? "#e3f2fd" : "transparent",
                  borderLeft: conversation.id === activeConversationId ? "4px solid #2196f3" : "4px solid transparent",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  if (conversation.id !== activeConversationId) {
                    e.currentTarget.style.backgroundColor = "#f5f5f5";
                  }
                }}
                onMouseLeave={(e) => {
                  if (conversation.id !== activeConversationId) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    fontWeight: conversation.unreadCount && conversation.unreadCount > 0 ? "bold" : "normal",
                    fontSize: "1rem",
                    marginBottom: "0.25rem"
                  }}>
                    {conversation.name}
                  </div>
                  {conversation.lastMessage && (
                    <div style={{ 
                      fontSize: "0.85rem", 
                      color: "#666",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}>
                      {conversation.lastMessage}
                    </div>
                  )}
                </div>
                <div style={{ 
                  fontSize: "0.75rem", 
                  color: "#999",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "0.25rem"
                }}>
                  {conversation.lastMessageTime}
                  {conversation.unreadCount && conversation.unreadCount > 0 && (
                    <div style={{
                      backgroundColor: "#f44336",
                      color: "white",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontWeight: "bold"
                    }}>
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel de droite - Chat actuel */}
        <div style={{ 
          flex: 1,
          display: "flex", 
          flexDirection: "column"
        }}>
          {/* En-tête du chat avec nom de la conversation et statut de connexion */}
          <div style={{
            padding: "1rem",
            borderBottom: "1px solid #ccc",
            backgroundColor: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <h3 style={{ margin: 0, fontSize: "1.2rem" }}>
              {activeConversation?.name || "Chat"}
            </h3>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "0.5rem",
              fontSize: "0.9rem",
              color: isConnected ? "#4caf50" : "#f44336"
            }}>
              {isConnected ? "🟢 Connecté" : "🔴 Déconnecté"}
            </div>
          </div>

          {/* Conteneur des messages */}
          <div
            style={{
              flex: 1,
              padding: "1rem",
              overflowY: "auto",
              backgroundColor: "#fafafa",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem"
            }}
          >
            {/* On affiche tous les messages reçus */}
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                  maxWidth: "70%",
                  alignSelf: idx % 2 === 0 ? "flex-start" : "flex-end", // Alternance pour simulation
                  backgroundColor: idx % 2 === 0 ? "white" : "#e3f2fd"
                }}
              >
                {msg}
              </div>
            ))}
          </div>

          {/* Zone de saisie avec input et bouton */}
          <div style={{ 
            padding: "1rem",
            borderTop: "1px solid #ccc",
            backgroundColor: "#fff",
            display: "flex", 
            gap: "0.5rem" 
          }}>
            {/* Champ de saisie */}
            <input
              style={{ 
                flex: 1,
                padding: "0.75rem",
                border: `1px solid ${!isConnected ? "#ffcdd2" : "#ddd"}`,
                borderRadius: "20px",
                fontSize: "1rem",
                outline: "none",
                backgroundColor: !isConnected ? "#fafafa" : "white",
                color: !isConnected ? "#999" : "black"
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={!isConnected ? "Connexion en cours..." : "Tapez votre message..."}
              // Suppression du disabled pour permettre le focus
            />

            {/* Bouton pour envoyer le message */}
            <button 
              onClick={handleSend}
              disabled={!isConnected || input.trim() === ""}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: isConnected && input.trim() !== "" ? "#2196f3" : "#ccc",
                color: "white",
                border: "none",
                borderRadius: "20px",
                fontSize: "1rem",
                cursor: isConnected && input.trim() !== "" ? "pointer" : "not-allowed",
                transition: "all 0.2s ease"
              }}
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}