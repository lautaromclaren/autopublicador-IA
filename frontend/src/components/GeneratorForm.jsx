// VERSIÓN CORRECTA Y VERIFICADA - src/components/GeneratorForm.jsx

import { useState } from 'react';
import axios from 'axios';
import AIResponse from './AIResponse.jsx';

function GeneratorForm() {
  const [idea, setIdea] = useState('');
  const [variations, setVariations] = useState([]); 
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setVariations([]);
    setError('');

    try {
      const result = await axios.post('http://localhost:3001/api/generate', { idea });
      setVariations(result.data.generatedVariations);
    } catch (error) {
      console.error('Error al enviar la idea:', error);
      setError('Ocurrió un error al generar el contenido.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '2rem', borderRadius: '8px', marginTop: '2rem' }}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="idea-input" style={{ display: 'block', marginBottom: '1rem', fontSize: '1.2rem' }}>
          Introduce tu idea para la publicación:
        </label>
        <textarea
          id="idea-input"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Ej: Vendo zapatillas Nike Air, talle 42, poco uso..."
          style={{ width: '100%', minHeight: '100px', padding: '0.5rem', fontSize: '1rem', marginBottom: '1rem' }}
        />
        <button type="submit" disabled={isLoading} style={{ padding: '0.8rem 1.5rem', fontSize: '1rem', cursor: 'pointer' }}>
          {isLoading ? 'Generando...' : 'Generar Publicación'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      <AIResponse variations={variations} isLoading={isLoading} />
    </div>
  );
}

export default GeneratorForm;