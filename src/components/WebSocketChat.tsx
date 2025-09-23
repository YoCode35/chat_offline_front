import React, { useState, useEffect } from 'react';
import './WebSocketChat.css';

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

// Hook personnalisé pour gérer le swipe
const useSwipe = (onSwipeLeft: () => void, onSwipeRight: () => void, threshold: number = 50) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > threshold;
    const isRightSwipe = distance < -threshold;

    if (isLeftSwipe) {
      onSwipeLeft();
    } else if (isRightSwipe) {
      onSwipeRight();
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
};

export default function WebSocketChat() {
  const { messages, sendMessage, isConnected } = useWebSocket();
  const [input, setInput] = useState("");
  const [activeConversationId, setActiveConversationId] = useState("general");
  const [showUsers, setShowUsers] = useState(true);
  const [showConversations, setShowConversations] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Fonction pour fermer la sidebar et afficher les messages
  const showChatArea = () => {
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  // Hook de swipe pour la zone de chat
  const chatSwipeHandlers = useSwipe(
    () => {}, // Swipe gauche -> rien
    () => { // Swipe droite -> ouvrir sidebar
      if (isMobile) {
        setShowSidebar(true);
      }
    },
    50 // Seuil plus élevé pour éviter les déclenchements accidentels
  );

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
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const handleUserClick = (userId: string) => {
    // Logique pour démarrer une conversation privée avec l'utilisateur
    console.log("Conversation avec:", userId);
    if (isMobile) {
      setShowSidebar(false);
    }
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

  // Composant pour les éléments avec swipe
  const SwipeableItem: React.FC<{
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
    isActive?: boolean;
  }> = ({ children, onClick, className = "", isActive = false }) => {
    const itemSwipeHandlers = useSwipe(
      () => {
        onClick();
        showChatArea();
      },
      () => {},
      30
    );

    return (
      <div
        className={`swipe-item ${className} ${isActive ? 'active' : ''}`}
        onClick={onClick}
        {...(isMobile ? itemSwipeHandlers : {})}
      >
        {children}
      </div>
    );
  };

  // Sidebar Component
  const Sidebar = () => (
    <div className={`sidebar ${isMobile ? 'sidebar-mobile' : 'sidebar-desktop'} ${
      isMobile ? (showSidebar ? 'sidebar-visible' : 'sidebar-hidden') : ''
    }`}>
      
      {/* Header mobile avec bouton fermer */}
      {isMobile && (
        <div className="mobile-header">
          <h3 className="mobile-header-title">Chat</h3>
          <div className="mobile-header-actions">
            <span className="mobile-hint-text">
              Glissez ← sur les éléments
            </span>
            <button
              onClick={() => setShowSidebar(false)}
              className="close-button"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      {/* Panel des utilisateurs avec accordéon */}
      <div className={`users-panel ${!showConversations ? 'users-panel-no-conversations' : ''}`}>
        <div 
          onClick={() => setShowUsers(!showUsers)}
          className="panel-header"
        >
          <div className="panel-header-title">
            <span className={`panel-arrow ${showUsers ? 'expanded' : ''}`}>▶</span>
            👥 Utilisateurs
          </div>
          <div className="users-count">
            {onlineUsers}/{totalUsers} en ligne
          </div>
        </div>

        {showUsers && (
          <div className={`users-list ${isMobile ? '' : 'users-list-desktop'}`}>
            {users
              .sort((a, b) => {
                const statusOrder = { "online": 0, "away": 1, "offline": 2 };
                return statusOrder[a.status] - statusOrder[b.status];
              })
              .map((user) => (
                <SwipeableItem
                  key={user.id}
                  onClick={() => handleUserClick(user.id)}
                  className="user-item"
                >
                  <div className="user-avatar-container">
                    <div className="user-avatar">
                      {user.avatar}
                    </div>
                    <div className={`user-status-dot status-${user.status}`} />
                  </div>

                  <div className="user-info">
                    <div className={`user-name ${user.status}`}>
                      {user.username}
                    </div>
                    <div className={`user-status-text ${user.status}`}>
                      {getStatusText(user)}
                    </div>
                  </div>

                  {user.status === "online" && (
                    <div className="user-online-indicator" />
                  )}
                </SwipeableItem>
              ))}
          </div>
        )}
      </div>

      {/* Panel des conversations avec accordéon */}
      <div className="conversations-panel">
        <div 
          onClick={() => setShowConversations(!showConversations)}
          className="panel-header"
        >
          <div className="panel-header-title">
            <span className={`panel-arrow ${showConversations ? 'expanded' : ''}`}>▶</span>
            💬 Conversations
          </div>
        </div>

        {showConversations && (
          <div className="conversations-list">
            {conversations.map((conversation) => (
              <SwipeableItem
                key={conversation.id}
                onClick={() => handleConversationChange(conversation.id)}
                className="conversation-item"
                isActive={conversation.id === activeConversationId}
              >
                <div className="conversation-content">
                  <div className={`conversation-name ${
                    conversation.unreadCount && conversation.unreadCount > 0 ? 'unread' : ''
                  }`}>
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
                    <div className="conversation-unread-badge">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              </SwipeableItem>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Overlay pour mobile
  const MobileOverlay = () => (
    isMobile && showSidebar ? (
      <div
        className="mobile-overlay"
        onClick={() => setShowSidebar(false)}
      />
    ) : null
  );

  return (
    <div className="websocket-chat-container">
      <MobileOverlay />
      
      <div className="websocket-chat-main">
        
        {/* Sidebar - Position absolue sur mobile */}
        <Sidebar />

        {/* Panel central - Chat actuel */}
        <div 
          className={`chat-main ${isMobile ? 'chat-main-mobile chat-area' : ''}`}
          {...(isMobile ? chatSwipeHandlers : {})}
        >
          <div className="chat-header">
            <div className="chat-header-left">
              {/* Bouton hamburger pour mobile */}
              {isMobile && (
                <button
                  onClick={() => setShowSidebar(true)}
                  className="hamburger-button"
                >
                  ☰
                </button>
              )}
              <h3 className="chat-title">
                {activeConversation?.name || "Chat"}
              </h3>
            </div>
            <div className="chat-header-right">
              <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
                {isConnected ? "🟢 Connecté" : "🔴 Déconnecté"}
              </div>
            </div>
          </div>

          <div className="messages-container">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`message-bubble ${isMobile ? 'message-bubble-mobile' : ''} ${
                  idx % 2 === 0 ? 'from-other' : 'from-me'
                }`}
              >
                {msg}
              </div>
            ))}
          </div>

          <div className="input-container">
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
              className={`send-button ${isMobile ? 'send-button-mobile' : ''} ${
                isConnected && input.trim() !== "" ? 'enabled' : 'disabled'
              }`}
            >
              {isMobile ? "📤" : "Envoyer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}