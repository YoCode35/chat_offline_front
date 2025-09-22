// On importe le composant WebSocketChat depuis le dossier components
import WebSocketChat from "./components/WebSocketChat";

// Définition du composant App
function App() {
  // La fonction retourne du JSX, qui décrit l'UI de ce composant
  return (
    <div> {/* Conteneur principal de l'application */}
      <h1>Chat Off Line</h1> {/* Titre principal de l'application */}
      <WebSocketChat /> {/* Ici on intègre notre composant de chat */}
    </div>
  );
}

// On exporte le composant App pour pouvoir l'importer et l'utiliser ailleurs (notamment dans main.tsx)
export default App;
