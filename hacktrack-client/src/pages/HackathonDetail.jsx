import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { hackathonsApi } from '../services/api';

export default function HackathonDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);

  useEffect(() => {
    const fetchHackathonDetail = async () => {
      try {
        setLoading(true);
        const data = await hackathonsApi.getById(id);
        
        if (!data.teams) {
          data.teams = [];
        }
        
        setHackathon(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathonDetail();
  }, [id]);

  const handleCreateTeam = async () => {
    if (!isAuthenticated) {
      alert('Vous devez être connecté pour créer une équipe');
      navigate('/login');
      return;
    }
    
    try {
      setIsCreatingTeam(true);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      const teamName = prompt('Nom de l\'équipe:');
      if (!teamName) {
        setIsCreatingTeam(false);
        return;
      }
      
      const teamData = {
        name: teamName,
        hackathonId: parseInt(id)
      };
      
      const response = await fetch('http://localhost:3002/teams/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(teamData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create team');
      }
      
      const updatedHackathon = await hackathonsApi.getById(id);
      
      if (!updatedHackathon.teams) {
        updatedHackathon.teams = [];
      }
      
      setHackathon(updatedHackathon);
      
      alert('Équipe créée avec succès!');
    } catch (error) {
      alert(`Erreur: ${error.message}`);
    } finally {
      setIsCreatingTeam(false);
    }
  };

  const handleJoinTeam = async (teamId) => {
    if (!isAuthenticated) {
      alert('Vous devez être connecté pour rejoindre une équipe');
      navigate('/login');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      const response = await fetch(`http://localhost:3002/teams/join/${teamId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to join team');
      }
      
      const updatedHackathon = await hackathonsApi.getById(id);
      
      if (!updatedHackathon.teams) {
        updatedHackathon.teams = [];
      }
      
      setHackathon(updatedHackathon);
      
      alert('Vous avez rejoint l\'équipe avec succès!');
    } catch (error) {
      alert(`Erreur: ${error.message}`);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!hackathon) return <div>Hackathon non trouvé</div>;

  const now = new Date();
  const startDate = new Date(hackathon.startDate);
  const endDate = new Date(hackathon.endDate);
  
  let status;
  if (endDate < now) {
    status = { label: 'Terminé', color: '#6c757d' };
  } else if (startDate <= now && endDate >= now) {
    status = { label: 'En cours', color: '#28a745' };
  } else {
    status = { label: 'À venir', color: '#007bff' };
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h1>{hackathon.name}</h1>
        <span style={{ 
          padding: '0.25rem 0.75rem', 
          borderRadius: '20px', 
          backgroundColor: status.color, 
          color: 'white',
          fontSize: '0.9rem'
        }}>
          {status.label}
        </span>
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <p><strong>Thème:</strong> {hackathon.theme}</p>
        <p><strong>Date:</strong> {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}</p>
        <p><strong>Description:</strong> {hackathon.description}</p>
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h2>Équipes inscrites</h2>
          <button 
            onClick={handleCreateTeam}
            disabled={isCreatingTeam}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: isCreatingTeam ? '#cccccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isCreatingTeam ? 'not-allowed' : 'pointer'
            }}
          >
            {isCreatingTeam ? 'Création en cours...' : 'Créer une équipe'}
          </button>
        </div>
        
        {hackathon.teams && hackathon.teams.length === 0 ? (
          <p>Aucune équipe inscrite pour le moment.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {hackathon.teams && hackathon.teams.map(team => (
              <div 
                key={team.id}
                style={{ 
                  border: '1px solid #eee',
                  padding: '1rem',
                  borderRadius: '4px'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <h3 style={{ margin: 0 }}>{team.name}</h3>
                  <button 
                    onClick={() => handleJoinTeam(team.id)}
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Rejoindre
                  </button>
                </div>
                <p><strong>Membres:</strong> {team.users && team.users.map(user => user.name).join(', ')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
