// On importe useState pour gérer l'état local du champ de saisie
import { useState } from "react";

// On importe notre hook personnalisé useWebSocket pour gérer la connexion WebSocket
import { useWebSocket } from "../hooks/useWebSocket";

// Définition du composant WebSocketChat
export default function WebSocketChat() {
  // On utilise le hook useWebSocket avec l'URL du serveur WebSocket
  // On récupère :
  // - messages : la liste des messages reçus
  // - sendMessage : fonction pour envoyer un message
  // - isConnected : booléen pour savoir si la connexion est active
  const { messages, sendMessage, isConnected } = useWebSocket("ws://localhost:8080");

  // État local pour stocker le texte tapé par l'utilisateur dans l'input
  const [input, setInput] = useState("");

  // Fonction appelée quand l'utilisateur clique sur "Envoyer"
  const handleSend = () => {
    // On ignore les messages vides ou contenant seulement des espaces
    if (input.trim() !== "") {
      sendMessage(input); // On envoie le message au WebSocket
      setInput("");       // On vide le champ de saisie
    }
  };

  // JSX rendu par le composant
  return (
    <div>
      {/* Titre du chat avec indicateur de connexion (vert/rouge) */}
      <h2>Chat WebSocket {isConnected ? "🟢" : "🔴"}</h2>

      {/* Conteneur des messages */}
      <div
        style={{
          border: "1px solid #ccc",   // bordure grise
          padding: "1rem",            // marge intérieure
          height: "200px",            // hauteur fixe
          overflowY: "auto",          // scroll vertical si nécessaire
        }}
      >
        {/* On affiche tous les messages reçus */}
        {messages.map((msg, idx) => (
          <div key={idx}>{msg}</div> // Chaque message a une clé unique
        ))}
      </div>

      {/* Champ de saisie */}
      <input
        value={input}                      // valeur contrôlée par l'état
        onChange={(e) => setInput(e.target.value)} // mise à jour de l'état au changement
        placeholder="Tape ton message..."  // texte indicatif
      />

      {/* Bouton pour envoyer le message */}
      <button onClick={handleSend}>Envoyer</button>
    </div>
  );
}
