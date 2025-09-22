import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // <- important : doit correspondre exactement au nom du fichier App.tsx

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
