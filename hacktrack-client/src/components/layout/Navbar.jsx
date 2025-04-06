import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to="/" style={{ marginRight: '1rem', fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none' }}>HackTrack</Link>
          <Link to="/hackathons" style={{ marginRight: '1rem', textDecoration: 'none' }}>Hackathons</Link>
        </div>
        <div>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '1rem' }}>
                Bonjour, {user.name}
              </span>
              <button 
                onClick={logout} 
                style={{ 
                  padding: '0.5rem 1rem',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Se déconnecter
              </button>
            </div>
          ) : (
            <>
              <Link 
                to="/login" 
                style={{ 
                  marginRight: '1rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px'
                }}
              >
                Se connecter
              </Link>
              <Link 
                to="/register"
                style={{ 
                  padding: '0.5rem 1rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px'
                }}
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
