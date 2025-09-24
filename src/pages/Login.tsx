import { useState } from "react";
import { useNavigate } from "react-router";

/**
 * Composant de connexion utilisateur
 * Gère l'authentification avec validation côté client et communication API
 */


export default function Login() {

  const navigate = useNavigate();
  // ========== ÉTATS DU COMPOSANT ==========
  
  /**
   * Données du formulaire de connexion
   * Structure cohérente avec l'API backend
   */
  const [formData, setFormData] = useState({
    username: "",  // Nom d'utilisateur (obligatoire)
    password: ""   // Mot de passe (obligatoire)
  });
  
  /**
   * États de contrôle de l'interface utilisateur
   */
  const [error, setError] = useState("");              // Messages d'erreur à afficher
  const [loading, setLoading] = useState(false);      // État de chargement (désactive les inputs)
  const [showPassword, setShowPassword] = useState(false); // Toggle visibilité mot de passe

  // ========== GESTIONNAIRES D'ÉVÉNEMENTS ==========

  /**
   * Gestionnaire de changement des champs de saisie
   * Utilise le pattern de mise à jour immutable avec spread operator
   * @param e - Événement de changement de l'input
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // Destructuration pour récupérer name et value
    
    // Mise à jour immutable de l'état
    setFormData(prev => ({
      ...prev,        // Copie de l'état précédent
      [name]: value   // Mise à jour du champ modifié (computed property)
    }));
    
    // UX : Effacer l'erreur dès que l'utilisateur commence à taper
    if (error) setError("");
  };

  // ========== VALIDATION ==========

  /**
   * Validation côté client du formulaire
   * @returns {boolean} - true si valide, false sinon
   */
  const validateForm = () => {
    // Vérification que les champs obligatoires ne sont pas vides
    // .trim() supprime les espaces en début/fin pour éviter les champs "vides"
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Le nom d\'utilisateur et le mot de passe sont obligatoires');
      return false;
    }
    return true;
  };

  // ========== AUTHENTIFICATION ==========

  /**
   * Fonction principale d'authentification
   * Gère la communication avec l'API backend et le traitement des réponses
   */
  const submitLogin = async () => {
    try {
      // Préparation des données à envoyer (format attendu par l'API)
      const dataToSend = {
        username: formData.username,
        password: formData.password
      };

      // Logs de debug pour le développement
      console.log('Données de connexion envoyées:', dataToSend);
      console.log('URL complète:', new URL('/auth/login', window.location.origin).href);

      // ========== REQUÊTE API ==========
      const response = await fetch('http://127.0.0.1:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Indique que nous envoyons du JSON
        },
        body: JSON.stringify(dataToSend) // Conversion de l'objet JS en JSON
      });

      // Logs de debug pour analyser la réponse
      console.log('Status de la réponse:', response.status);
      console.log('Headers de la réponse:', response.headers.get('content-type'));

      // ========== TRAITEMENT DE LA RÉPONSE ==========
      
      // Récupération du contenu brut de la réponse
      // Important : .text() avant .json() pour gérer les réponses vides ou malformées
      const responseText = await response.text();
      console.log('Réponse brute du serveur:', responseText);

      // ========== GESTION DES ERREURS HTTP ==========
      if (!response.ok) {
        let errorMessage = 'Erreur lors de la connexion'; // Message par défaut
        
        // Tentative de parsing de l'erreur JSON si la réponse n'est pas vide
        if (responseText.trim()) {
          try {
            const errorData = JSON.parse(responseText);
            // Gestion flexible : le backend peut renvoyer "error" ou "message"
            errorMessage = errorData.error || errorData.message || errorMessage;
            
            // Messages d'erreur spécifiques selon le code de statut HTTP
            if (response.status === 401) {
              errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect';
            } else if (response.status === 404) {
              errorMessage = 'Utilisateur non trouvé';
            }
          } catch (parseError) {
            // Si le JSON est malformé, utiliser le texte brut
            console.warn('Impossible de parser l\'erreur JSON:', parseError);
            errorMessage = responseText || `Erreur HTTP ${response.status}`;
          }
        } else {
          // Réponse vide avec code d'erreur
          errorMessage = `Erreur HTTP ${response.status} - Réponse vide`;
        }
        
        // Lancement de l'exception pour être catchée plus bas
        throw new Error(errorMessage);
      }

      // ========== TRAITEMENT DU SUCCÈS ==========
      
      let data;

        try {
          data = JSON.parse(responseText);
          
        } catch {
          // Fallback si le JSON de succès est malformé
          console.warn('Réponse de succès non-JSON:', responseText);

        }


          const { token, currentUser } = data;
          localStorage.setItem('token', token);
          localStorage.setItem('currentUserId', String(currentUser.id));
          localStorage.setItem('currentUserName', currentUser.username);
          navigate('/chat');          
    } catch (error) {
      // ========== GESTION GLOBALE DES ERREURS ==========
      
      console.error('Erreur complète:', error);
      
      // Type guard pour s'assurer que c'est bien une Error
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Une erreur est survenue lors de la connexion';
        
      setError(errorMessage);
    }
  };

  // ========== GESTIONNAIRE DE SOUMISSION ==========

  /**
   * Gestionnaire principal de soumission du formulaire
   * Orchestre la validation, l'état de chargement et la soumission
   * @param e - Événement de soumission (optionnel pour flexibilité)
   */
  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    // Prévention du comportement par défaut du navigateur
    if (e) e.preventDefault();

    // ========== VALIDATION PRÉALABLE ==========
    if (!validateForm()) {
      return; // Arrêt si la validation échoue
    }

    // ========== GESTION DE L'ÉTAT DE CHARGEMENT ==========
    setLoading(true);  // Désactive les inputs et change l'UI
    setError('');      // Efface les erreurs précédentes

    // Exécution de la connexion
    await submitLogin();

    // Réactivation de l'interface (dans tous les cas)
    setLoading(false);
  };

  // ========== RENDU DU COMPOSANT ==========
  return (
    <div className="home">
      {/* Container principal centré */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: '1rem'
      }}>
        <h1>Connexion</h1>
        
        {/* ========== AFFICHAGE CONDITIONNEL DES ERREURS ========== */}
        {error && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#f8d7da',    // Rouge Bootstrap danger
            color: '#721c24',              // Texte rouge foncé
            border: '1px solid #f5c6cb',   // Bordure rouge claire
            borderRadius: '4px',
            width: '100%',
            maxWidth: '300px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        {/* ========== FORMULAIRE PRINCIPAL ========== */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          minWidth: '300px',
          padding: '2rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: 'white',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' // Ombre subtile
        }}>          
          
          {/* ========== CHAMP NOM D'UTILISATEUR ========== */}
          <input 
            type="text" 
            name="username"                    // Correspond à la clé dans formData
            placeholder="Nom d'utilisateur *"  // Indication visuelle requis
            value={formData.username}          // Controlled component
            onChange={handleChange}            // Handler unifié
            required                          // Validation HTML5
            disabled={loading}                // Désactivé pendant le chargement
            style={{
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              opacity: loading ? 0.6 : 1      // Feedback visuel de désactivation
            }}
          />
          
          {/* ========== CHAMP MOT DE PASSE AVEC TOGGLE VISIBILITÉ ========== */}
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? "text" : "password"} // Toggle dynamique du type
              name="password"
              placeholder="Mot de passe *" 
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                padding: '0.75rem',
                paddingRight: '2.5rem',       // Espace pour le bouton toggle
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                width: '100%',
                boxSizing: 'border-box',      // Inclut padding dans la largeur
                opacity: loading ? 0.6 : 1
              }}
            />
            
            {/* Bouton toggle visibilité mot de passe */}
            <button
              type="button"                   // Évite la soumission du formulaire
              onClick={() => setShowPassword(!showPassword)} // Toggle state
              disabled={loading}
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)', // Centrage vertical parfait
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8rem',
                color: '#666',
                opacity: loading ? 0.6 : 1
              }}
            >
              {showPassword ? '🙈' : '👁️'}    {/* Émojis pour l'UX */}
            </button>
          </div>
          
          {/* ========== BOUTON DE SOUMISSION ========== */}
          <button 
            onClick={handleSubmit}            // Handler click
            type="button"                     // Évite le comportement form par défaut
            disabled={loading}                // Désactivé pendant chargement
            style={{
              padding: '0.75rem',
              backgroundColor: loading ? '#6c757d' : '#28a745', // Gris si loading, vert sinon
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer', // Curseur adapté
              marginTop: '0.5rem',
              transition: 'background-color 0.3s' // Animation douce
            }}
          >
            {/* Texte dynamique selon l'état */}
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </div>
        
        {/* ========== LIEN VERS L'INSCRIPTION ========== */}
        <p style={{ 
          marginTop: '1rem', 
          color: '#666',
          fontSize: '0.9rem'
        }}>
          Pas encore de compte ? 
          <a href="/register" style={{ 
            color: '#007bff',               // Bleu Bootstrap primary
            textDecoration: 'none',
            marginLeft: '0.25rem'
          }}>
            Inscrivez-vous ici
          </a>
        </p>
      </div>
    </div>
  );
}