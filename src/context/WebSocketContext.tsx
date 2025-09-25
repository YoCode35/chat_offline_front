// contexts/WebSocketContext.tsx
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { SocketMessage } from "../types/Socket.type";

const WebSocketContext = createContext<{
  send: (socketMessage: SocketMessage) => void;
  socketMessages: SocketMessage[];
  isConnected: boolean;
} | null>(null);

export function WebSocketProvider({
  children,
  token,
}: {
  children: React.ReactNode;
  token: string;
}) {
  const ws = useRef<WebSocket | null>(null);
  const [socketMessages, setsocketMessages] = useState<SocketMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }
    ws.current = new WebSocket(
      `ws://localhost:3000/chat?token=${encodeURIComponent(token)}`
    );

    ws.current.onopen = () => {
      console.log("✅ Connected to WebSocket");
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setsocketMessages((prev) => [...prev, message]);
    };

    ws.current.onclose = () => {
      console.log("❌ Disconnected from WebSocket");
      setIsConnected(false);
    };
    return () => {
      ws.current?.close();
    };
  });

  const send = (message: SocketMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return (
    <WebSocketContext.Provider value={{ send, socketMessages, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context)
    throw new Error("useWebSocket must be used within WebSocketProvider");
  return context;
}
