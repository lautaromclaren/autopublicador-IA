// src/components/Header.jsx - VERSIÓN FINAL Y SIMPLIFICADA

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Al cerrar sesión, siempre vamos al login
  };

  return (
    <header className="header">
      <div className="header-title">
        {/* El logo SIEMPRE apunta al Dashboard si estás logueado. */}
        <Link to="/dashboard">
          <h2>Autopublicador IA</h2>
        </Link>
      </div>
      
      <nav className="header-nav">
        {isAuthenticated ? (
          <>
            {user && <span>Hola, {user.email}</span>}
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/history">Historial</Link>
            <Link to="/connections">Conexiones</Link>
            <button onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            {/* ESTA PARTE NUNCA DEBERÍA MOSTRARSE SI EL HEADER SOLO ESTÁ EN LAS RUTAS PROTEGIDAS,
                PERO LO DEJAMOS POR SEGURIDAD Y PARA LA LANDING PAGE SI DECIDIMOS CAMBIAR DE NUEVO. */}
            <Link to="/login">Iniciar Sesión</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;