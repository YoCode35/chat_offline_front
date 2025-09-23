import { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    pseudo: "",
    email: "",
    motdepasse: "",
    confirmMotdepasse: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Réinitialiser l'erreur quand l'utilisateur tape
    if (error) setError('');
  };

  const validateForm = () => {
    // Validation des champs requis
    if (!formData.nom.trim() || !formData.prenom.trim() || !formData.pseudo.trim() ||
      !formData.email.trim() || !formData.motdepasse.trim()) {
      setError('Tous les champs sont obligatoires');
      return false;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Format d\'email invalide');
      return false;
    }

    // Validation mot de passe
    if (formData.motdepasse.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    // Confirmation mot de passe
    if (formData.motdepasse !== formData.confirmMotdepasse) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }

    // Validation pseudo (pas d'espaces)
    if (formData.pseudo.includes(' ')) {
      setError('Le pseudo ne doit pas contenir d\'espaces');
      return false;
    }

    return true;
  };

  const submitRegistration = async () => {
    try {
      // Préparer les données à envoyer (sans la confirmation du mot de passe)
      const dataToSend = {
        nom: formData.nom,
        prenom: formData.prenom,
        pseudo: formData.pseudo,
        email: formData.email,
        motdepasse: formData.motdepasse
      };

      console.log('Données envoyées:', dataToSend); // Pour débugger

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      console.log('Status de la réponse:', response.status); // Pour débugger
      console.log('Headers de la réponse:', response.headers.get('content-type')); // Pour débugger

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'inscription');
      }

      const data = await response.json();
      console.log('Inscription réussie:', data);

      // Inscription réussie
      setSuccess(true);
      setFormData({
        nom: "",
        prenom: "",
        pseudo: "",
        email: "",
        motdepasse: "",
        confirmMotdepasse: ""
      });

      // Optionnel : redirection après 2 secondes
      setTimeout(() => {
        // window.location.href = '/login'; // ou navigation avec votre router
        console.log('Redirection vers la page de connexion...');
      }, 2000);

    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'inscription');
    }
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();

    // Validation côté client
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    await submitRegistration();

    setIsLoading(false);
  };

  // Si inscription réussie, afficher message de succès
  if (success) {
    return (
      <div className="home">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            padding: '2rem',
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            borderRadius: '8px',
            textAlign: 'center',
            maxWidth: '400px'
          }}>
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
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <h1>Inscription</h1>

        {/* Affichage des erreurs */}
        {error && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            width: '100%',
            maxWidth: '300px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <div onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          minWidth: '300px',
          padding: '2rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: 'white',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}>
          <input
            type="text"
            name="nom"
            placeholder="Nom"
            value={formData.nom}
            onChange={handleChange}
            required
            disabled={isLoading}
            style={{
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              opacity: isLoading ? 0.6 : 1
            }}
          />

          <input
            type="text"
            name="prenom"
            placeholder="Prénom"
            value={formData.prenom}
            onChange={handleChange}
            required
            disabled={isLoading}
            style={{
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              opacity: isLoading ? 0.6 : 1
            }}
          />

          <input
            type="text"
            name="pseudo"
            placeholder="Pseudo (sans espaces)"
            value={formData.pseudo}
            onChange={handleChange}
            required
            disabled={isLoading}
            style={{
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              opacity: isLoading ? 0.6 : 1
            }}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            style={{
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              opacity: isLoading ? 0.6 : 1
            }}
          />

          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              name="motdepasse"
              placeholder="Mot de passe (min. 6 caractères)"
              value={formData.motdepasse}
              onChange={handleChange}
              required
              disabled={isLoading}
              style={{
                padding: '0.75rem',
                paddingRight: '2.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                width: '100%',
                boxSizing: 'border-box',
                opacity: isLoading ? 0.6 : 1
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8rem',
                color: '#666',
                opacity: isLoading ? 0.6 : 1
              }}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <input
            type={showPassword ? "text" : "password"}
            name="confirmMotdepasse"
            placeholder="Confirmer le mot de passe"
            value={formData.confirmMotdepasse}
            onChange={handleChange}
            required
            disabled={isLoading}
            style={{
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem',
              opacity: isLoading ? 0.6 : 1
            }}
          />

          <button
            onClick={handleSubmit}
            type="button"
            disabled={isLoading}
            style={{
              padding: '0.75rem',
              backgroundColor: isLoading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
              transition: 'background-color 0.3s'
            }}
          >
            {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
          </button>
        </div>
      </div>
    </div>
  );
}