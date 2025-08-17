// src/pages/ConnectionsPage.jsx

import Header from '../components/Header';
import '../App.css';

function ConnectionsPage() {

  const handleFacebookConnect = () => {
const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${import.meta.env.VITE_FACEBOOK_APP_ID}&redirect_uri=${import.meta.env.VITE_FACEBOOK_REDIRECT_URI}&scope=public_profile`;
    // Redirigimos al usuario a la URL de autorización de Facebook
    window.location.href = facebookAuthUrl;
  };

  return (
    <div>
      <Header />
      <main className="main-container">
        <h1>Gestionar Conexiones</h1>
        <p>Conecta tus cuentas de redes sociales para empezar a automatizar.</p>

        <div style={{ marginTop: '2rem', border: '1px solid #ccc', padding: '2rem', borderRadius: '8px' }}>
          <h3>Facebook</h3>
          <p>Conecta tu perfil de Facebook para acceder a tus grupos.</p>
          <button onClick={handleFacebookConnect} style={{ padding: '0.8rem 1.5rem', fontSize: '1rem', cursor: 'pointer', backgroundColor: '#1877F2', color: 'white', border: 'none', borderRadius: '5px' }}>
            Conectar con Facebook
          </button>
        </div>
      </main>
    </div>
  );
}

export default ConnectionsPage;