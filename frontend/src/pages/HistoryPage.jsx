// src/pages/HistoryPage.jsx

import { useState, useEffect } from 'react';
import { apiClient } from '../context/AuthContext';
import Header from '../components/Header';
import '../App.css'; // Importamos los mismos estilos globales

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await apiClient.get('/generations');
        setHistory(response.data);
      } catch (err) {
        setError('No se pudo cargar el historial.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div>
      <Header />
      <main className="main-container">
        <h1>Tu Historial de Generaciones</h1>
        
        {isLoading && <p>Cargando historial...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {!isLoading && !error && history.length === 0 && (
          <p>Aún no has generado ningún contenido. ¡Ve al Dashboard para empezar!</p>
        )}

        <div style={{ marginTop: '2rem' }}>
          {history.map((item) => (
            <div key={item._id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                <strong>Fecha:</strong> {new Date(item.createdAt).toLocaleString()}
              </p>
              <p><strong>Tu idea:</strong> {item.prompt}</p>
              <div style={{ marginTop: '1rem' }}>
                <h4>Variaciones Generadas:</h4>
                {item.variations.map((variation, index) => (
                  variation && <div key={index} style={{ padding: '1rem', backgroundColor: '#f9f9f9', border: '1px solid #eee', borderRadius: '5px', marginTop: '0.5rem' }}>
                    <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontFamily: 'inherit' }}>
                      {variation}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default HistoryPage;