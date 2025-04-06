import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hackathonsApi } from '../services/api';

export default function HackathonsList() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHackathons, setTotalHackathons] = useState(0);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        setLoading(true);
        const data = await hackathonsApi.getAll();
        
        setTotalHackathons(data.length);
        
        const calculatedTotalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
        setTotalPages(calculatedTotalPages);
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = data.slice(startIndex, endIndex);
        
        setHackathons(paginatedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const categorizeHackathons = () => {
    const now = new Date();
    
    const categorized = {
      past: [],
      current: [],
      upcoming: []
    };
    
    hackathons.forEach(hackathon => {
      const startDate = new Date(hackathon.startDate);
      const endDate = new Date(hackathon.endDate);
      
      if (endDate < now) {
        categorized.past.push(hackathon);
      } else if (startDate <= now && endDate >= now) {
        categorized.current.push(hackathon);
      } else {
        categorized.upcoming.push(hackathon);
      }
    });
    
    return categorized;
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  const categorizedHackathons = categorizeHackathons();

  return (
    <div style={{ padding: '2rem 0' }}>
      <h1 style={{ marginBottom: '2rem' }}>Tous les Hackathons</h1>
      
      <div style={{ marginBottom: '1rem' }}>
        <p>Affichage de {hackathons.length} hackathons sur {totalHackathons} au total</p>
      </div>
      
      {categorizedHackathons.current.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#28a745' }}>En cours</h2>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            {categorizedHackathons.current.map(hackathon => (
              <HackathonCard key={hackathon.id} hackathon={hackathon} />
            ))}
          </div>
        </section>
      )}
      
      {categorizedHackathons.upcoming.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#007bff' }}>À venir</h2>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            {categorizedHackathons.upcoming.map(hackathon => (
              <HackathonCard key={hackathon.id} hackathon={hackathon} />
            ))}
          </div>
        </section>
      )}
      
      {categorizedHackathons.past.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#6c757d' }}>Passés</h2>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            {categorizedHackathons.past.map(hackathon => (
              <HackathonCard key={hackathon.id} hackathon={hackathon} />
            ))}
          </div>
        </section>
      )}
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginTop: '2rem' 
      }}>
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          style={{
            padding: '0.5rem 1rem',
            margin: '0 0.5rem',
            background: currentPage === 1 ? '#e9e9e9' : '#007bff',
            color: currentPage === 1 ? '#666' : 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
          }}
        >
          Précédent
        </button>
        
        <div style={{ display: 'flex' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              style={{
                padding: '0.5rem 1rem',
                margin: '0 0.25rem',
                background: currentPage === page ? '#28a745' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          style={{
            padding: '0.5rem 1rem',
            margin: '0 0.5rem',
            background: currentPage === totalPages ? '#e9e9e9' : '#007bff',
            color: currentPage === totalPages ? '#666' : 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
          }}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}

function HackathonCard({ hackathon }) {
  return (
    <div 
      style={{ 
        border: '1px solid #eee',
        padding: '1rem',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}
    >
      <h3>{hackathon.name}</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span>Thème: {hackathon.theme}</span>
        <span>Équipes: {hackathon.registeredTeams}</span>
      </div>
      <p>Date: {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}</p>
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
  );
}
