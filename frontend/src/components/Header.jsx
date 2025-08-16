// src/components/Header.jsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- Usamos nuestro nuevo hook

function Header() {
  // Ahora también obtenemos el 'user' y la función 'logout' del contexto
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Llama a la función logout del contexto
    navigate('/login'); // Redirige al usuario
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
            {user && <span style={{ marginRight: '1rem' }}>Hola, {user.email}</span>}
            <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid white', color: 'white', cursor: 'pointer', padding: '0.5rem 1rem', borderRadius: '5px' }}>
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', margin: '0 10px' }}>Iniciar Sesión</Link>
            <Link to="/register" style={{ color: 'white', margin: '0 10px' }}>Registrarse</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;