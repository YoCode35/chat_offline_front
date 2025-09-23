// On importe la bibliothèque React, nécessaire pour créer des composants
import React from "react";

// On importe ReactDOM pour pouvoir "monter" notre application dans le DOM du navigateur
import ReactDOM from "react-dom/client";

// On importe BrowserRouter pour gérer la navigation entre plusieurs pages avec React Router
import { BrowserRouter } from "react-router-dom";

// On importe notre composant racine App.tsx
import App from "./App.tsx";

// On importe le fichier CSS global pour appliquer le style à toute l'application
import "./app.css";

// Ici on récupère l'élément HTML avec l'id "root" (défini dans index.html) et on crée un root React
ReactDOM.createRoot(document.getElementById("root")!).render(
  // React.StrictMode est un outil de développement qui active des vérifications et avertissements supplémentaires
  <React.StrictMode>
    {/* On encapsule App dans BrowserRouter pour activer le routage */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);