import { useState } from "react";
import { useNavigate } from "react-router-dom";

export interface RegisterResponse {
  token: string;
  currentUser: {
    id: number;
    username: string;
  };
}
export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmMotdepasse: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Réinitialiser l'erreur quand l'utilisateur tape
    if (error) setError("");
  };

  const validateForm = () => {
    // Validation des champs requis (seulement nom et mot de passe)
    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Le nom et le mot de passe sont obligatoires");
      return false;
    }

    // Validation mot de passe
    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }

    // Confirmation mot de passe (seulement si confirmMotdepasse est rempli)
    if (
      formData.confirmMotdepasse &&
      formData.password !== formData.confirmMotdepasse
    ) {
      setError("Les mots de passe ne correspondent pas");
      return false;
    }
    return true;
  };

  const submitRegistration = async () => {
    try {
      const dataToSend = {
        username: formData.username,
        password: formData.password,
      };

      console.log("Données envoyées:", dataToSend); // Pour débugger
      console.log(
        "URL complète:",
        new URL("/auth/register", window.location.origin).href
      );

      const response = await fetch("http://127.0.0.1:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      console.log("Status de la réponse:", response.status); // Pour débugger
      console.log(
        "Headers de la réponse:",
        response.headers.get("content-type")
      ); // Pour débugger

      // Récupérer le texte brut de la réponse d'abord
      const responseText = await response.text();
      console.log("Réponse brute du serveur:", responseText); // Pour débugger

      if (!response.ok) {
        let errorMessage = "Erreur lors de l'inscription";

        // Essayer de parser le JSON seulement si la réponse n'est pas vide
        if (responseText.trim()) {
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.message || errorMessage;
          } catch (parseError) {
            console.warn("Impossible de parser l'erreur JSON:", parseError);
            errorMessage = responseText || `Erreur HTTP ${response.status}`;
          }
        } else {
          errorMessage = `Erreur HTTP ${response.status} - Réponse vide`;
        }

        throw new Error(errorMessage);
      }

      // Parser la réponse de succès
      let data;
      try {
        data = JSON.parse(responseText) as RegisterResponse;
      } catch {
        console.warn("Réponse de succès non-JSON:", responseText);
      }
      if (!data) {
        return;
      }
      setSuccess(true);
      const { token, currentUser } = data;
      localStorage.setItem("token", token);
      localStorage.setItem("currentUserId", String(currentUser.id));
      localStorage.setItem("currentUserName", currentUser.username);
      navigate("/chat");
      console.log("Inscription réussie:", data);
    } catch (error) {
      console.error("Erreur complète:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'inscription"
      );
    }
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    setError("");

    await submitRegistration();

    setIsLoading(false);
  };
  if (success) {
    return (
      <div className="home">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              padding: "2rem",
              backgroundColor: "#d4edda",
              color: "#155724",
              border: "1px solid #c3e6cb",
              borderRadius: "8px",
              textAlign: "center",
              maxWidth: "400px",
            }}
          >
            <h2>✅ Inscription réussie !</h2>
            <p>Votre compte a été créé avec succès.</p>
            <p>Redirection en cours...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <h1>Inscription</h1>

        {/* Affichage des erreurs */}
        {error && (
          <div
            style={{
              padding: "0.75rem",
              backgroundColor: "#f8d7da",
              color: "#721c24",
              border: "1px solid #f5c6cb",
              borderRadius: "4px",
              width: "100%",
              maxWidth: "300px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <div
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            minWidth: "300px",
            padding: "2rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "white",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <input
            type="text"
            name="username"
            placeholder="Nom *"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={isLoading}
            style={{
              padding: "0.75rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "1rem",
              opacity: isLoading ? 0.6 : 1,
            }}
          />
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mot de passe * (min. 6 caractères)"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              style={{
                padding: "0.75rem",
                paddingRight: "2.5rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1rem",
                width: "100%",
                boxSizing: "border-box",
                opacity: isLoading ? 0.6 : 1,
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              style={{
                position: "absolute",
                right: "0.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.8rem",
                color: "#666",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <input
            type={showPassword ? "text" : "password"}
            name="confirmMotdepasse"
            placeholder="Confirmer le mot de passe (optionnel)"
            value={formData.confirmMotdepasse}
            onChange={handleChange}
            disabled={isLoading}
            style={{
              padding: "0.75rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "1rem",
              opacity: isLoading ? 0.6 : 1,
            }}
          />

          <button
            onClick={handleSubmit}
            type="button"
            disabled={isLoading}
            style={{
              padding: "0.75rem",
              backgroundColor: isLoading ? "#6c757d" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              cursor: isLoading ? "not-allowed" : "pointer",
              marginTop: "0.5rem",
              transition: "background-color 0.3s",
            }}
          >
            {isLoading ? "Inscription en cours..." : "S'inscrire"}
          </button>
        </div>
      </div>
    </div>
  );
}
