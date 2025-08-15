// src/components/AIResponse.jsx

import { useState } from 'react';

// <-- CAMBIO 1: Ahora recibe 'variations' (un array) en lugar de 'content'
function AIResponse({ variations, isLoading }) {
  const [copyStatus, setCopyStatus] = useState({}); // Usamos un objeto para el estado de cada botón

  const handleCopy = (textToCopy, index) => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopyStatus({ [index]: '¡Copiado!' }); // Actualizamos el estado para el botón específico
        setTimeout(() => {
          setCopyStatus(prev => ({ ...prev, [index]: null })); // Lo reseteamos después de 2 segundos
        }, 2000);
      })
      .catch(err => {
        console.error('Error al copiar el texto: ', err);
        setCopyStatus({ [index]: 'Error' });
      });
  };

  if (isLoading) {
    return <p style={{ marginTop: '1rem' }}>Generando variaciones con IA...</p>;
  }

  // Si el array está vacío, no mostramos nada
  if (!variations || variations.length === 0) {
    return null;
  }

  // <-- CAMBIO 2: Mapeamos el array de variaciones para renderizar cada una
  return (
    <div style={{ marginTop: '2rem' }}>
      <h4>Variaciones generadas por IA:</h4>
      {variations.map((variation, index) => (
        // Usamos el índice como 'key' para que React identifique cada elemento
        variation && <div key={index} style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f0f0f0', border: '1px solid #ddd', borderRadius: '8px' }}>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontFamily: 'inherit', fontSize: '1rem' }}>
            {variation}
          </pre>
          <button onClick={() => handleCopy(variation, index)} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            {copyStatus[index] || 'Copiar Texto'}
          </button>
        </div>
      ))}
    </div>
  );
}

export default AIResponse;