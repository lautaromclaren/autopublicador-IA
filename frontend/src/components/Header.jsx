// src/components/Header.jsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{ 
        backgroundColor: '#1a1a1a', 
        padding: '1rem 2rem', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>
        <h2>Autopublicador IA</h2>
      </Link>
      
      <nav style={{ display: 'flex', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            {/* Si el usuario existe, mostramos su email */}
            {user && <span style={{ marginRight: '1.5rem' }}>Hola, {user.email}</span>}

            {/* ENLACES PARA USUARIO AUTENTICADO */}
            <Link to="/" style={{ color: 'white', margin: '0 10px', textDecoration: 'underline' }}>Dashboard</Link>
            <Link to="/history" style={{ color: 'white', margin: '0 10px', textDecoration: 'underline' }}>Historial</Link>

            <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid white', color: 'white', cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '5px', marginLeft: '1.5rem' }}>
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            {/* ENLACES PARA VISITANTES */}
            <Link to="/login" style={{ color: 'white', margin: '0 10px' }}>Iniciar Sesión</Link>
            <Link to="/register" style={{ color: 'white', margin: '0 10px' }}>Registrarse</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;