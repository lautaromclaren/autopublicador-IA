// src/components/TargetGroups.jsx

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { apiClient } from '../context/AuthContext';
import './TargetGroups.css';

function TargetGroups() {
  const { user } = useAuth();
  const [groupSets, setGroupSets] = useState([]);
  const [selectedSetId, setSelectedSetId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchGroupSets = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await apiClient.get('/groupsets');
      setGroupSets(response.data);
    } catch (error) {
      console.error("Error al cargar los conjuntos", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchGroupSets();
  }, [fetchGroupSets]);
  
  const selectedSet = groupSets.find(set => set._id === selectedSetId);
  const selectedGroupsCount = selectedSet ? selectedSet.groups.length : 0;

  return (
    <div className="target-groups-container">
      <h3>Audiencia de Destino</h3>
      
      {isLoading ? (
        <p>Cargando conjuntos...</p>
      ) : groupSets.length > 0 ? (
        <div>
          <label htmlFor="group-set-select" style={{display: 'block', marginBottom: '0.5rem'}}>Selecciona una "Carpetita":</label>
          <select 
            id="group-set-select"
            value={selectedSetId} 
            onChange={(e) => setSelectedSetId(e.target.value)}
            style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', marginBottom: '1rem' }}
          >
            <option value="">-- Elige una audiencia --</option>
            {groupSets.map(set => (
              <option key={set._id} value={set._id}>{set.name}</option>
            ))}
          </select>

          {selectedSet && (
            <div className="groups-list">
              <p><strong>{selectedGroupsCount} grupos en esta selección:</strong></p>
              {selectedSet.groups.map(group => (
                <div key={group.id} className="group-item">
                  {group.name}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="no-groups-message">
          Aún no has creado ninguna "Carpetita".
        </p>
      )}

      <Link to="/connections" className="manage-groups-link">
        Gestionar Carpetitas
      </Link>
    </div>
  );
}

export default TargetGroups;