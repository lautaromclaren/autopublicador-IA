// src/components/TargetGroups.jsx

import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './TargetGroups.css'; // Importaremos un CSS dedicado

function TargetGroups() {
  const { user } = useAuth();
  const selectedGroups = user?.selectedFacebookGroups || [];

  return (
    <div className="target-groups-container">
      <h3>Grupos Seleccionados</h3>
      {selectedGroups.length > 0 ? (
        <div className="groups-list">
          {selectedGroups.map(group => (
            <div key={group.id} className="group-item">
              {group.name}
            </div>
          ))}
        </div>
      ) : (
        <p className="no-groups-message">
          No has guardado ninguna selección de grupos.
        </p>
      )}
      <Link to="/connections" className="manage-groups-link">
        Gestionar Grupos
      </Link>
    </div>
  );
}

export default TargetGroups;