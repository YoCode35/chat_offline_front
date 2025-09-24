import React, { useState, useEffect } from 'react';

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

  const pulseKeyframes = `
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
      }
    }
    @keyframes slideIn {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(0);
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
      }
      to {
        transform: translateX(-100%);
      }
    }
    @keyframes swipeHint {
      0% { transform: translateX(0); }
      50% { transform: translateX(-10px); }
      100% { transform: translateX(0); }
    }
    @keyframes swipeHintRight {
      0% { transform: translateX(0); }
      50% { transform: translateX(10px); }
      100% { transform: translateX(0); }
    }
    .swipe-item {
      position: relative;
      overflow: hidden;
    }
    .swipe-item::after {
      content: '← Glissez pour ouvrir le chat';
      position: absolute;
      top: 50%;
      right: -200px;
      transform: translateY(-50%);
      background: linear-gradient(135deg, #2196f3, #21cbf3);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.75rem;
      white-space: nowrap;
      opacity: 0;
      transition: all 0.3s ease;
      pointer-events: none;
      box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
    }
    .swipe-item:active::after {
      right: 10px;
      opacity: 1;
    }
    .chat-area {
      position: relative;
      overflow: hidden;
    }
    .chat-area::before {
      content: 'Glissez → pour ouvrir le menu';
      position: fixed;
      top: 50%;
      left: -250px;
      transform: translateY(-50%);
      background: linear-gradient(135deg, #4caf50, #66bb6a);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0 25px 25px 0;
      font-size: 0.8rem;
      white-space: nowrap;
      opacity: 0;
      transition: all 0.3s ease;
      pointer-events: none;
      box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
      z-index: 100;
    }
    .chat-area:active::before {
      left: 0;
      opacity: 0.9;
    }
  `;

  // Composant pour les éléments avec swipe
  const SwipeableItem: React.FC<{
    children: React.ReactNode;
    onClick: () => void;
    style?: React.CSSProperties;
    className?: string;
  }> = ({ children, onClick, style, className }) => {
    const itemSwipeHandlers = useSwipe(
      () => {
        onClick();
        showChatArea();
      },
      () => {},
      30
    );

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      if (style?.backgroundColor !== '#e3f2fd') { // Pas pour l'élément actif
        e.currentTarget.style.backgroundColor = style?.backgroundColor === 'transparent' ? '#f5f5f5' : '#f0f0f0';
      }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      if (style?.backgroundColor !== '#e3f2fd') { // Pas pour l'élément actif
        e.currentTarget.style.backgroundColor = style?.backgroundColor === '#e3f2fd' ? '#e3f2fd' : 'transparent';
      }
    };

    return (
      <div
        className={`swipe-item ${className || ''}`}
        style={style}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...(isMobile ? itemSwipeHandlers : {})}
      >
        {children}
      </div>
    );
  };

  // Sidebar Component
  const Sidebar = () => (
    <div style={{ 
      width: isMobile ? '100vw' : '380px',
      height: '100vh',
      position: isMobile ? 'fixed' : 'relative',
      top: 0,
      left: 0,
      zIndex: isMobile ? 1000 : 'auto',
      backgroundColor: '#f8f9fa',
      borderRight: isMobile ? 'none' : '1px solid #ccc',
      display: 'flex',
      flexDirection: 'column',
      transform: isMobile ? (showSidebar ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
      transition: 'transform 0.3s ease-in-out'
    }}>
      
      {/* Header mobile avec bouton fermer */}
      {isMobile && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#2196f3',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0 }}>Chat</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>
              Glissez ← sur les éléments
            </span>
            <button
              onClick={() => setShowSidebar(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.25rem'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      {/* Panel des utilisateurs avec accordéon */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        backgroundColor: '#f8f9fa',
        borderBottom: showConversations ? '1px solid #ccc' : 'none'
      }}>
        <div 
          onClick={() => setShowUsers(!showUsers)}
          style={{ 
            padding: '1rem', 
            borderBottom: '1px solid #ccc', 
            backgroundColor: '#fff', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
        >
          <div style={{ fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ transform: showUsers ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>▶</span>
            👥 Utilisateurs
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            {onlineUsers}/{totalUsers} en ligne
          </div>
        </div>

        {showUsers && (
          <div style={{ 
            maxHeight: isMobile ? '200px' : '300px', 
            overflowY: 'auto',
            transition: 'max-height 0.3s ease'
          }}>
            {users
              .sort((a, b) => {
                const statusOrder = { "online": 0, "away": 1, "offline": 2 };
                return statusOrder[a.status] - statusOrder[b.status];
              })
              .map((user) => (
                <SwipeableItem
                  key={user.id}
                  onClick={() => handleUserClick(user.id)}
                  style={{ 
                    padding: '0.75rem 1rem', 
                    borderBottom: '1px solid #eee', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    cursor: 'pointer', 
                    transition: 'background-color 0.2s ease',
                    touchAction: 'pan-x', // Permet le swipe horizontal
                    backgroundColor: 'transparent'
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <div style={{ fontSize: '2rem' }}>
                      {user.avatar}
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      border: '2px solid white',
                      boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
                      backgroundColor: user.status === 'online' ? '#4caf50' : user.status === 'away' ? '#ff9800' : '#9e9e9e'
                    }} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.95rem',
                      marginBottom: '0.25rem',
                      fontWeight: user.status === 'online' ? 600 : 'normal',
                      color: user.status === 'offline' ? '#999' : 'black'
                    }}>
                      {user.username}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: user.status === 'online' ? '#4caf50' : user.status === 'away' ? '#ff9800' : '#9e9e9e'
                    }}>
                      {getStatusText(user)}
                    </div>
                  </div>

                  {user.status === "online" && (
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#4caf50',
                      animation: 'pulse 2s infinite'
                    }} />
                  )}
                </SwipeableItem>
              ))}
          </div>
        )}
      </div>

      {/* Panel des conversations avec accordéon */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        backgroundColor: '#f8f9fa' 
      }}>
        <div 
          onClick={() => setShowConversations(!showConversations)}
          style={{ 
            padding: '1rem', 
            borderBottom: '1px solid #ccc', 
            backgroundColor: '#fff', 
            fontWeight: 'bold', 
            fontSize: '1.1rem',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
        >
          <span style={{ transform: showConversations ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>▶</span>
          💬 Conversations
        </div>

        {showConversations && (
          <div style={{ 
            flex: 1, 
            overflowY: 'auto',
            transition: 'opacity 0.3s ease'
          }}>
            {conversations.map((conversation) => (
              <SwipeableItem
                key={conversation.id}
                onClick={() => handleConversationChange(conversation.id)}
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer',
                  borderLeft: `4px solid ${conversation.id === activeConversationId ? '#2196f3' : 'transparent'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  transition: 'all 0.2s ease',
                  backgroundColor: conversation.id === activeConversationId ? '#e3f2fd' : 'transparent',
                  touchAction: 'pan-x' // Permet le swipe horizontal
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '1rem',
                    marginBottom: '0.25rem',
                    fontWeight: conversation.unreadCount && conversation.unreadCount > 0 ? 'bold' : 'normal'
                  }}>
                    {conversation.name}
                  </div>
                  {conversation.lastMessage && (
                    <div style={{
                      fontSize: '0.85rem',
                      color: '#666',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {conversation.lastMessage}
                    </div>
                  )}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#999',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '0.25rem'
                }}>
                  {conversation.lastMessageTime}
                  {conversation.unreadCount && conversation.unreadCount > 0 && (
                    <div style={{
                      backgroundColor: '#f44336',
                      color: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 'bold'
                    }}>
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
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999
        }}
        onClick={() => setShowSidebar(false)}
      />
    ) : null
  );

  return (
    <div style={{ margin: 0, padding: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <style
  dangerouslySetInnerHTML={{
    __html: `
      ${pulseKeyframes}
      * { box-sizing: border-box; }
      body { margin: 0; padding: 0; overflow: hidden; }

      /* Messages d'aide affichés uniquement en mobile */
      ${isMobile ? `
        .swipe-item::after {
          content: '← Glissez pour ouvrir le chat';
        }
        .chat-area::before {
          content: 'Glissez → pour ouvrir le menu';
        }
      ` : `
        .swipe-item::after,
        .chat-area::before {
          content: none !important;
        }
      `}
    `,
  }}
/>
      
      <MobileOverlay />
      
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        display: 'flex', 
        backgroundColor: 'white', 
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        position: 'relative'
      }}>
        
        {/* Sidebar - Position absolue sur mobile */}
        {!isMobile && <Sidebar />}
        {isMobile && <Sidebar />}

        {/* Panel central - Chat actuel */}
        <div 
          className={isMobile ? "chat-area" : ""}
          style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            width: isMobile ? '100vw' : 'auto',
            touchAction: isMobile ? 'pan-x pan-y' : 'auto' // Permet swipe horizontal et scroll vertical
          }}
          {...(isMobile ? chatSwipeHandlers : {})}
        >
          <div style={{
            padding: '1rem',
            borderBottom: '1px solid #ccc',
            backgroundColor: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Bouton hamburger pour mobile */}
              {isMobile && (
                <button
                  onClick={() => setShowSidebar(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    padding: '0.25rem'
                  }}
                >
                  ☰
                </button>
              )}
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
                {activeConversation?.name || "Chat"}
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                color: isConnected ? '#4caf50' : '#f44336'
              }}>
                {isConnected ? "🟢 Connecté" : "🔴 Déconnecté"}
              </div>
            </div>
          </div>

          <div style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            backgroundColor: '#fafafa',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  maxWidth: isMobile ? '85%' : '70%',
                  alignSelf: idx % 2 === 0 ? 'flex-start' : 'flex-end',
                  backgroundColor: idx % 2 === 0 ? 'white' : '#e3f2fd'
                }}
              >
                {msg}
              </div>
            ))}
          </div>

          <div style={{
            padding: '1rem',
            borderTop: '1px solid #ccc',
            backgroundColor: '#fff',
            display: 'flex',
            gap: '0.5rem'
          }}>
            <input
              style={{
                flex: 1,
                padding: '0.75rem',
                border: `1px solid ${!isConnected ? '#ffcdd2' : '#ddd'}`,
                borderRadius: '20px',
                fontSize: '1rem',
                outline: 'none',
                backgroundColor: !isConnected ? '#fafafa' : 'white',
                color: !isConnected ? '#999' : 'black',
                transition: 'border-color 0.2s ease'
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={!isConnected ? "Connexion en cours..." : "Tapez votre message..."}
            />

            <button 
              onClick={handleSend}
              disabled={!isConnected || input.trim() === ""}
              style={{
                padding: '0.75rem 1.5rem',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                fontSize: isMobile ? '0.9rem' : '1rem',
                transition: 'all 0.2s ease',
                backgroundColor: isConnected && input.trim() !== "" ? '#2196f3' : '#ccc',
                cursor: isConnected && input.trim() !== "" ? 'pointer' : 'not-allowed'
              }}
            >
              {isMobile ? "📤" : "Envoyer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}