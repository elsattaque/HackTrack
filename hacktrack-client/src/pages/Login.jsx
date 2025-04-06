import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../services/api';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis')
});

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, authError, clearError } = useAuth();
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    
    clearError();
  }, [isAuthenticated, navigate, clearError]);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError(null);
    
    try {
      const response = await authApi.login({
        email: data.email,
        password: data.password
      });
      
      const { token } = response;
      
      await login(token, { email: data.email });
      
      navigate('/');
    } catch (error) {
      if (error.message.includes('Invalid credentials')) {
        setServerError('Email ou mot de passe incorrect. Veuillez réessayer.');
      } else {
        setServerError('Erreur de connexion. Veuillez réessayer plus tard.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem 0', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Connexion</h1>
      
      {(serverError || authError) && (
        <div style={{ 
          padding: '0.75rem', 
          backgroundColor: '#f8d7da', 
          color: '#721c24',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {serverError || authError}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            style={{ 
              width: '100%', 
              padding: '0.5rem',
              borderRadius: '4px',
              border: errors.email ? '1px solid #dc3545' : '1px solid #ced4da'
            }}
          />
          {errors.email && (
            <p style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.email.message}
            </p>
          )}
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Mot de passe
          </label>
          <input
            {...register('password')}
            type="password"
            style={{ 
              width: '100%', 
              padding: '0.5rem',
              borderRadius: '4px',
              border: errors.password ? '1px solid #dc3545' : '1px solid #ced4da'
            }}
          />
          {errors.password && (
            <p style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.password.message}
            </p>
          )}
        </div>
        
        <button 
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
