// src/pages/ConnectionsPage.jsx - VERSIÓN COMPLETA Y FINAL CON useCallback

import { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import '../App.css';
import { apiClient } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';

function ConnectionsPage() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState({});

  const isFacebookConnected = user && user.facebookId;

  const handleLoadGroups = useCallback(async () => {
    setError('');
    setIsLoading(true);
    try {
      const response = await apiClient.get('/facebook/groups');
      setGroups(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudieron cargar los grupos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFacebookConnected) {
      handleLoadGroups();
    }
  }, [isFacebookConnected, handleLoadGroups]);

  useEffect(() => {
    if (user && user.selectedFacebookGroups && Array.isArray(user.selectedFacebookGroups)) {
      const initialSelection = user.selectedFacebookGroups.reduce((acc, group) => {
        acc[group.id] = true;
        return acc;
      }, {});
      setSelectedGroups(initialSelection);
    }
  }, [user, groups]);

  const handleGroupSelect = (groupId) => {
    setSelectedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const handleMockConnect = async () => {
    setError('');
    setMessage('');
    setIsLoading(true);
    try {
      const response = await apiClient.get('/auth/facebook/callback/mock');
      setMessage(response.data.message + ' Por favor, refresca la página para ver los cambios.');
    } catch (error) {
      setError('Error al simular la conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSelection = async () => {
    setIsLoading(true);
    setError('');
    setMessage('');
    try {
      const selectionToSave = Object.keys(selectedGroups).filter(groupId => selectedGroups[groupId]).map(groupId => {
        const group = groups.find(g => g.id === groupId);
        return { id: group.id, name: group.name };
      });
      await apiClient.post('/user/groups', { selectedGroups: selectionToSave });
      setMessage('¡Selección guardada con éxito!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('No se pudo guardar la selección.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCount = Object.values(selectedGroups).filter(Boolean).length;

  return (
    <div>
      <Header />
      <main className="main-container">
        <h1>Gestionar Conexiones y Grupos</h1>
        <p>Conecta tus cuentas y selecciona los grupos donde quieres publicar.</p>
        <div style={{ marginTop: '2rem', border: '1px solid #ccc', padding: '2rem', borderRadius: '8px' }}>
          <h3>Facebook</h3>
          {isFacebookConnected ? (
            <div>
              <p style={{ color: 'green', fontWeight: 'bold' }}>✓ Conectado a Facebook (Modo Simulación)</p>
            </div>
          ) : (
            <div>
              <p>Conecta tu perfil para acceder a tus grupos.</p>
              <button disabled style={{ backgroundColor: '#ccc' }}>Conectar con Facebook (Pendiente)</button>
              <hr style={{ margin: '2rem 0' }} />
              <h4>-- Solo para Desarrollo --</h4>
              <p>Usa este botón para simular una conexión exitosa.</p>
              <button onClick={handleMockConnect} disabled={isLoading}>
                {isLoading ? 'Procesando...' : 'Simular Conexión'}
              </button>
            </div>
          )}
          {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
          {isLoading && !groups.length && <p>Cargando grupos...</p>}
          {groups.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h4>Tus Grupos ({selectedCount} seleccionados):</h4>
              <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #eee', padding: '1rem', borderRadius: '8px' }}>
                {groups.map(group => (
                  <label key={group.id} style={{ display: 'flex', alignItems: 'center', padding: '0.8rem', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedGroups[group.id] || false}
                      onChange={() => handleGroupSelect(group.id)}
                      style={{ marginRight: '1rem', transform: 'scale(1.2)' }}
                    />
                    {group.name}
                  </label>
                ))}
              </div>
              <button onClick={handleSaveSelection} disabled={isLoading} style={{ marginTop: '1rem', padding: '0.8rem 1.5rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
                {isLoading ? 'Guardando...' : 'Guardar Selección'}
              </button>
              {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ConnectionsPage;