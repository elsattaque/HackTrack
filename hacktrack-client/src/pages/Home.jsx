import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hackathonsApi } from '../services/api';

export default function Home() {
  const [upcomingHackathons, setUpcomingHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const hackathons = await hackathonsApi.getAll();
        
        const today = new Date();
        const upcoming = hackathons
          .filter(hackathon => new Date(hackathon.startDate) > today)
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
          .slice(0, 3);
        
        setUpcomingHackathons(upcoming);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHackathons();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div style={{ padding: '2rem 0' }}>
      <h1 style={{ marginBottom: '2rem' }}>Bienvenue sur HackTrack</h1>
      
      <section style={{ marginBottom: '2rem' }}>
        <h2>La plateforme d'organisation de hackathons de votre école</h2>
        <p>Découvrez les prochains hackathons et constituez votre équipe !</p>
        <Link 
          to="/hackathons"
          style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            background: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            marginTop: '1rem'
          }}
        >
          Voir tous les hackathons
        </Link>
      </section>

      <section>
        <h2>Prochains hackathons</h2>
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          {upcomingHackathons.map(hackathon => (
            <div 
              key={hackathon.id} 
              style={{ 
                border: '1px solid #eee',
                padding: '1rem',
                borderRadius: '4px'
              }}
            >
              <h3>{hackathon.name}</h3>
              <p>Date: {new Date(hackathon.startDate).toLocaleDateString()}</p>
              <p>{hackathon.description}</p>
              <Link 
                to={`/hackathons/${hackathon.id}`}
                style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  background: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  marginTop: '1rem'
                }}
              >
                En savoir plus
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
