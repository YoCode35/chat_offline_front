import { useState } from "react";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Données de connexion:", formData);
    // Ici vous pourrez ajouter la logique de connexion
  };

  return (
    <div className="home">
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: '1rem'
      }}>
        <h1>Connexion</h1>
        <form onSubmit={handleSubmit} style={{
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
            name="username"
            placeholder="Nom d'utilisateur" 
            value={formData.username}
            onChange={handleChange}
            required
            style={{
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
          
          <input 
            type="password" 
            name="password"
            placeholder="Mot de passe" 
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '1rem'
            }}
          />
          
          <button 
            type="submit"
            style={{
              padding: '0.75rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
              marginTop: '0.5rem',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#218838';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#28a745';
            }}
          >
            Se connecter
          </button>
        </form>
        
        {/* Lien vers la page d'inscription */}
        <p style={{ 
          marginTop: '1rem', 
          color: '#666',
          fontSize: '0.9rem'
        }}>
          Pas encore de compte ? 
          <a href="/register" style={{ 
            color: '#007bff', 
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
