import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import HackathonsList from './pages/HackathonsList';
import HackathonDetail from './pages/HackathonDetail';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hackathons" element={<HackathonsList />} />
            <Route path="/hackathons/:id" element={<HackathonDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App
