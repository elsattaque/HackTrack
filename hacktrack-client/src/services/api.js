const API_URL = 'http://localhost:3002';

async function fetchApi(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'An unknown error occurred');
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}

export const authApi = {
  register: (userData) => fetchApi('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  getCurrentUser: () => fetchApi('/auth/me'),
};

export const hackathonsApi = {
  getAll: (page = 1, limit = 10) => 
    fetchApi(`/hackathons?page=${page}&limit=${limit}`),
  
  getById: (id) => fetchApi(`/hackathons/${id}`),
};

export const teamsApi = {
  create: (teamData) => fetchApi('/teams/create', {
    method: 'POST',
    body: JSON.stringify(teamData),
  }),
  
  join: (teamId) => fetchApi(`/teams/join/${teamId}`, {
    method: 'POST',
  }),
};
