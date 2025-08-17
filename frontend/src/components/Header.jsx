// src/components/Header.jsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css'; // <-- 1. IMPORTAMOS NUESTRO NUEVO ARCHIVO CSS

function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    // 2. USAMOS 'className' PARA APLICAR LOS ESTILOS DEL ARCHIVO CSS
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