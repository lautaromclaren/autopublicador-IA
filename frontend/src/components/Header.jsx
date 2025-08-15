// src/components/Header.jsx

import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Header() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Llama a la función logout de nuestro AuthContext
    navigate('/login'); // Redirige al usuario al login
  };

  return (
    <header style={{ 
        backgroundColor: '#1a1a1a', 
        padding: '1rem', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
      {/* Usamos Link para una navegación más rápida sin recargar la página */}
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>
        <h2>Autopublicador IA</h2>
      </Link>
      
      <nav>
        {/* Lógica condicional: ¿está el usuario autenticado? */}
        {isAuthenticated ? (
          <>
            {/* Si SÍ está autenticado, muestra esto */}
            <Link to="/" style={{ color: 'white', margin: '0 10px' }}>Dashboard</Link>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1rem' }}>
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            {/* Si NO está autenticado, muestra esto */}
            <Link to="/login" style={{ color: 'white', margin: '0 10px' }}>Iniciar Sesión</Link>
            <Link to="/register" style={{ color: 'white', margin: '0 10px' }}>Registrarse</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;