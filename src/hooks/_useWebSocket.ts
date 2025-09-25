import { useEffect, useRef, useState } from "react";

export function useWebSocket(url: string) {
  const [messages, setMessages] = useState<string[]>([]);

  const [isConnected, setIsConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);

  // Effet pour gérer la connexion au serveur WebSocket
  useEffect(() => {
    // Création d'une nouvelle connexion WebSocket avec l'URL fournie
    const ws = new WebSocket(url);

    // On stocke l'objet WebSocket dans la référence pour y accéder plus tard
    wsRef.current = ws;

    // Quand la connexion s'ouvre avec succès
    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      setIsConnected(true); // On met à jour l'état pour indiquer que la connexion est active
    };

    // Quand un message est reçu du serveur
    ws.onmessage = (event) => {
      console.log("📩 Message reçu :", event.data);

      // On ajoute le nouveau message à la liste des messages existants
      setMessages((prev) => [...prev, event.data]);
    };

    // Quand la connexion se ferme
    ws.onclose = () => {
      console.log("❌ WebSocket disconnected");
      setIsConnected(false); // On met à jour l'état pour indiquer que la connexion est fermée
    };

    // Gestion des erreurs de connexion
    ws.onerror = (err) => {
      console.error("⚠️ WebSocket error", err);
    };

    // Nettoyage : quand le composant est démonté ou que l'URL change,
    // on ferme la connexion pour éviter les fuites mémoire
    return () => {
      ws.close();
    };
  }, [url]); // L'effet se relance uniquement si l'URL change

  // Fonction pour envoyer un message au serveur WebSocket
  const sendMessage = (message: string) => {
    // Vérifie que la connexion existe et est ouverte
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(message); // Envoi du message
    } else {
      console.warn("⚠️ WebSocket not connected"); // Sinon, avertissement
    }
  };

  // On retourne les données et fonctions utiles depuis le hook
  return { messages, sendMessage, isConnected };
}
