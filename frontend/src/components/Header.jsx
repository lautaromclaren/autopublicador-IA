// src/components/Header.jsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css'; // Importamos el CSS

function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-title">
        <Link to="/">
          <h2>Autopublicador IA</h2>
        </Link>
      </div>
      
      <nav className="header-nav">
        {isAuthenticated ? (
          <>
            {user && <span>Hola, {user.email}</span>}
            <Link to="/">Dashboard</Link>
            <Link to="/history">Historial</Link>
            <Link to="/connections">Conexiones</Link> {/* <-- ¡ENLACE AÑADIDO! */}
            <button onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar Sesión</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;