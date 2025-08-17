// src/components/GeneratorForm.jsx

import { useState } from 'react';
import { apiClient } from '../context/AuthContext';
import AIResponse from './AIResponse.jsx';
import './GeneratorForm.css'; // <-- 1. IMPORTAREMOS UN NUEVO ARCHIVO CSS

function GeneratorForm() {
  const [idea, setIdea] = useState('');
  const [tone, setTone] = useState('Venta'); // <-- 2. NUEVO ESTADO PARA EL TONO, 'Venta' es el default
  const [variations, setVariations] = useState([]); 
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 3. LISTA DE TONOS DISPONIBLES
  const availableTones = ['Venta', 'Creativo', 'Informativo', 'Divertido'];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setVariations([]);
    setError('');

    try {
      // 4. AHORA ENVIAMOS LA 'idea' Y EL 'tone' AL BACKEND
      const result = await apiClient.post('/generations', { idea, tone });
      setVariations(result.data.generatedVariations);
    } catch (error) {
      console.error('Error al enviar la idea:', error);
      setError('Ocurrió un error al generar el contenido.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="generator-form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="idea-input">
            1. Introduce tu idea para la publicación:
          </label>
          <textarea
            id="idea-input"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Ej: Vendo zapatillas Nike Air, talle 42, poco uso..."
            required
          />
        </div>

        {/* 5. NUEVA SECCIÓN PARA SELECCIONAR EL TONO */}
        <div className="form-group">
          <label>2. Elige un tono:</label>
          <div className="tone-selector">
            {availableTones.map((t) => (
              <button
                key={t}
                type="button"
                className={`tone-button ${tone === t ? 'active' : ''}`}
                onClick={() => setTone(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="generate-button">
          {isLoading ? 'Generando...' : '✨ Generar Publicación'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      <AIResponse variations={variations} isLoading={isLoading} />
    </div>
  );
}

export default GeneratorForm;