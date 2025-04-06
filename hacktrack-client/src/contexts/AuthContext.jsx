import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const validateToken = async (token) => {
    try {
      // Set basic user info without API call to avoid authorization errors
      setUser({ token });
      return true;
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
      setAuthError('Session expired. Please log in again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (token, userData) => {
    localStorage.setItem('token', token);
    setUser({ ...userData, token });
    setAuthError(null);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setAuthError(null);
  };

  const clearError = () => {
    setAuthError(null);
  };

  if (loading) {
    return <div>Chargement de l'authentification...</div>;
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isAuthenticated: !!user,
        authError,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
