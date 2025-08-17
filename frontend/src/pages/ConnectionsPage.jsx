// src/pages/ConnectionsPage.jsx

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import '../App.css';
import { apiClient } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';

function ConnectionsPage() {
  const { user } = useAuth(); // Obtenemos la info del usuario actual
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [groups, setGroups] = useState([]); // Nuevo estado para guardar la lista de grupos
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);

  // Verificamos si el usuario ya tiene una conexión simulada
  const isFacebookConnected = user && user.facebookId && user.facebookId.startsWith('MOCK_');

  const handleMockConnect = async () => {
    setError('');
    setMessage('');
    try {
      const response = await apiClient.get('/auth/facebook/callback/mock');
      setMessage(response.data.message + ' Refresca la página para ver los cambios o carga tus grupos.');
      // Idealmente, aquí deberíamos refrescar los datos del usuario en el AuthContext
    } catch (error) {
      setError('Error al simular la conexión.');
    }
  };
  
  const handleLoadGroups = async () => {
    setError('');
    setIsLoadingGroups(true);
    try {
      const response = await apiClient.get('/facebook/groups');
      setGroups(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudieron cargar los grupos.');
    } finally {
      setIsLoadingGroups(false);
    }
  };

  return (
    <div>
      <Header />
      <main className="main-container">
        <h1>Gestionar Conexiones</h1>
        <p>Conecta tus cuentas de redes sociales para empezar a automatizar.</p>

        <div style={{ marginTop: '2rem', border: '1px solid #ccc', padding: '2rem', borderRadius: '8px' }}>
          <h3>Facebook</h3>
          
          {isFacebookConnected ? (
            <div>
              <p style={{ color: 'green', fontWeight: 'bold' }}>✓ Conectado a Facebook (Modo Simulación)</p>
              <button onClick={handleLoadGroups} disabled={isLoadingGroups} style={{ padding: '0.8rem 1.5rem' }}>
                {isLoadingGroups ? 'Cargando...' : 'Cargar mis Grupos'}
              </button>
            </div>
          ) : (
            <div>
              <p>Conecta tu perfil para acceder a tus grupos.</p>
              {/* Deshabilitamos el botón real por ahora */}
              <button disabled style={{ backgroundColor: '#ccc' }}>Conectar con Facebook (Deshabilitado)</button>
              <hr style={{ margin: '2rem 0' }} />
              <h4>-- Solo para Desarrollo --</h4>
              <p>Usa este botón para simular una conexión exitosa.</p>
              <button onClick={handleMockConnect} style={{ backgroundColor: '#f0ad4e' }}>
                Simular Conexión a Facebook
              </button>
            </div>
          )}

          {message && <p style={{ marginTop: '1rem', color: 'blue' }}>{message}</p>}
          {error && <p style={{ marginTop: '1rem', color: 'red' }}>{error}</p>}

          {/* Nueva sección para mostrar la lista de grupos */}
          {groups.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h4>Tus Grupos:</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {groups.map(group => (
                  <li key={group.id} style={{ padding: '0.8rem', border: '1px solid #eee', borderRadius: '5px', marginBottom: '0.5rem' }}>
                    {group.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ConnectionsPage;