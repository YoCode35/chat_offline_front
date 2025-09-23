import { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    pseudo: "",
    email: "",
    motdepasse: ""
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
    console.log("Données d'inscription:", formData);
    // Ici vous pourrez ajouter la logique d'inscription
  };

  return (
    <div className="home">
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: '1rem'
      }}>
        <h1>Inscription</h1>
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
            name="nom"
            placeholder="Nom" 
            value={formData.nom}
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
            type="text" 
            name="prenom"
            placeholder="Prénom" 
            value={formData.prenom}
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
            type="text" 
            name="pseudo"
            placeholder="Pseudo" 
            value={formData.pseudo}
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
            type="email" 
            name="email"
            placeholder="Email" 
            value={formData.email}
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
            name="motdepasse"
            placeholder="Mot de passe" 
            value={formData.motdepasse}
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
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
              marginTop: '0.5rem'
            }}
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
}