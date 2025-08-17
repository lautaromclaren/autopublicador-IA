// src/pages/ConnectionsPage.jsx - VERSIÓN FINAL CON CRUD COMPLETO

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
  const [groupSets, setGroupSets] = useState([]);
  const [newSetName, setNewSetName] = useState('');

  const isFacebookConnected = user && user.facebookId;

  const fetchFacebookGroups = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/facebook/groups');
      setGroups(response.data);
    } catch (err) { setError(err.response?.data?.message || 'No se pudieron cargar los grupos.'); }
    finally { setIsLoading(false); }
  }, []);
  
  const fetchGroupSets = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/groupsets');
      setGroupSets(response.data);
    } catch (err) { console.error("Error al cargar los conjuntos de grupos", err); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => {
    if (isFacebookConnected) {
      fetchFacebookGroups();
      fetchGroupSets();
    }
  }, [isFacebookConnected, fetchFacebookGroups, fetchGroupSets]);

  const handleGroupSelect = (groupId) => {
    setSelectedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const handleCreateSet = async (e) => {
    e.preventDefault();
    const selectedGroupObjects = Object.keys(selectedGroups).filter(id => selectedGroups[id]).map(id => groups.find(g => g.id === id)).filter(Boolean);
    if (!newSetName || selectedGroupObjects.length === 0) {
      setError('Por favor, escribe un nombre y selecciona al menos un grupo.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await apiClient.post('/groupsets', { name: newSetName, groups: selectedGroupObjects });
      setNewSetName('');
      setSelectedGroups({});
      await fetchGroupSets();
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear el conjunto.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSet = async (setId) => {
    if (!window.confirm('¿Estás seguro de que quieres borrar esta carpetita? Esta acción no se puede deshacer.')) {
      return;
    }
    setIsLoading(true);
    try {
      await apiClient.delete(`/groupsets/${setId}`);
      await fetchGroupSets(); // Recargamos la lista
    } catch (err) {
      setError('No se pudo borrar el conjunto.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const selectedCount = Object.values(selectedGroups).filter(Boolean).length;
  
  const handleMockConnect = async () => {
    // ... (esta función se mantiene igual)
  };

  return (
    <div>
      <Header />
      <main className="main-container">
        <h1>Gestionar Conexiones y Grupos</h1>
        
        {!isFacebookConnected && (
            <div style={{ marginTop: '2rem', border: '1px solid #ccc', padding: '2rem', borderRadius: '8px' }}>
                <h4>-- Solo para Desarrollo --</h4>
                <p>Usa este botón para simular una conexión exitosa.</p>
                <button onClick={handleMockConnect}>Simular Conexión</button>
            </div>
        )}

        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}

        {isFacebookConnected && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                {/* Columna Izquierda: Tus Grupos de FB */}
                <div>
                    <h4>Tus Grupos de Facebook ({selectedCount} seleccionados)</h4>
                    <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #eee', padding: '1rem', borderRadius: '8px', background: '#fff' }}>
                        {isLoading && groups.length === 0 ? <p>Cargando grupos...</p> : 
                            groups.map(group => (
                                <label key={group.id} style={{ display: 'block', padding: '0.8rem', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}>
                                    <input type="checkbox" checked={selectedGroups[group.id] || false} onChange={() => handleGroupSelect(group.id)} style={{ marginRight: '0.8rem' }} />
                                    {group.name}
                                </label>
                            ))
                        }
                    </div>
                </div>

                {/* Columna Derecha: Conjuntos Guardados */}
                <div>
                    <h4>Conjuntos Guardados ("Carpetitas")</h4>
                    <div style={{ border: '1px solid #eee', padding: '1rem', minHeight: '265px', marginBottom: '1rem', borderRadius: '8px', background: '#fff' }}>
                        {isLoading && groupSets.length === 0 ? <p>Cargando conjuntos...</p> : null}
                        {groupSets.map(set => (
                            <div key={set._id} style={{ padding: '0.8rem', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>
                                    <strong>{set.name}</strong> ({set.groups.length} grupos)
                                </span>
                                <button onClick={() => handleDeleteSet(set._id)} disabled={isLoading} style={{ background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '0.3rem 0.6rem', cursor: 'pointer' }}>
                                    Borrar
                                </button>
                            </div>
                        ))}
                        {groupSets.length === 0 && !isLoading && <p style={{textAlign: 'center', color: '#666'}}>Aún no has creado ninguna carpetita.</p>}
                    </div>
                    <form onSubmit={handleCreateSet}>
                        <input 
                            type="text" value={newSetName} onChange={(e) => setNewSetName(e.target.value)}
                            placeholder="Nombre de la nueva carpetita" required style={{ width: '100%', padding: '0.8rem', marginBottom: '0.5rem', fontSize: '1rem' }}
                        />
                        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
                            {isLoading ? 'Creando...' : `Crear Carpetita con ${selectedCount} grupos`}
                        </button>
                    </form>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}

export default ConnectionsPage;