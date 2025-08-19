// src/pages/LandingPage.jsx

import { Link } from 'react-router-dom';
import './LandingPage.css';

// Componente Header específico para la Landing Page
const LandingHeader = () => (
  <header className="landing-header">
    <div className="landing-header-content">
      <div className="landing-logo">
        <h2>Autopublicador IA</h2>
      </div>
      <nav className="landing-nav">
        <Link to="/login" className="nav-link">Iniciar Sesión</Link>
        <Link to="/register" className="nav-button">Registrarse</Link>
      </nav>
    </div>
  </header>
);

function LandingPage() {
  return (
    <div className="landing-page-container">
      <LandingHeader />
      <main className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Tu Contenido en Piloto Automático.
            <br />
            Tu Crecimiento en Ascenso.
          </h1>
          <p className="hero-subtitle">
            La primera plataforma de IA que no solo programa tus publicaciones en grupos de Facebook, sino que las crea, las varía y las optimiza para maximizar el alcance orgánico. Sin riesgo de spam.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="cta-button primary">
              Empezar Gratis
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;