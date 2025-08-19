// src/components/GeneratorForm.jsx

import { useState } from 'react';
import { apiClient } from '../context/AuthContext';
import AIResponse from './AIResponse.jsx';
import Datetime from 'react-datetime';
import NumericInput from 'react-numeric-input';
import "react-datetime/css/react-datetime.css";
import moment from 'moment';
import './GeneratorForm.css';
import toast from 'react-hot-toast';

function GeneratorForm({ selectedSet }) {
  const [idea, setIdea] = useState('');
  const [tone, setTone] = useState('Venta');
  const [variations, setVariations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState(moment().add(10, 'minutes'));
  const [interval, setInterval] = useState(5);

  const availableTones = ['Venta', 'Creativo', 'Informativo', 'Divertido'];

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    toast.dismiss(); // Limpia toasts anteriores
    const toastId = toast.loading('Generando contenido con IA...'); // Toast de carga
    try {
      const result = await apiClient.post('/generations', { idea, tone });
      setVariations(result.data.generatedVariations);
      toast.success('Contenido generado con éxito.', { id: toastId }); // Actualiza el toast
    } catch (error) {
      toast.error('Error al generar contenido.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (variations.length === 0) return toast.error("Primero genera el contenido.");
    if (!selectedSet) return toast.error("Selecciona una 'Carpetita' de grupos.");
    
    setIsLoading(true);
    toast.dismiss();
    const toastId = toast.loading('Programando campaña...');
    try {
      // Usamos la ruta correcta de campañas
      await apiClient.post('/campaigns/schedule', {
        baseContentVariations: variations,
        groupSetId: selectedSet._id,
        schedulingOptions: {
          startTime: startTime.toISOString(),
          intervalMinutes: interval
        }
      });
      toast.success(`¡Campaña programada con éxito!`, { id: toastId });
      setVariations([]); // Limpiamos para la siguiente
    } catch (err) {
      toast.error('Error al programar la campaña.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="generator-form-container">
      <form onSubmit={handleGenerate}>
        <div className="form-group">
          <label htmlFor="idea-input">1. Introduce tu idea:</label>
          <textarea id="idea-input" value={idea} onChange={(e) => setIdea(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>2. Elige un tono:</label>
          <div className="tone-selector">
            {availableTones.map((t) => (
              <button key={t} type="button" className={`tone-button ${tone === t ? 'active' : ''}`} onClick={() => setTone(t)}>{t}</button>
            ))}
          </div>
        </div>
        <button type="submit" disabled={isLoading} className="generate-button">
          {isLoading ? 'Generando...' : '✨ 1. Generar Contenido'}
        </button>
      </form>
      
      <AIResponse variations={variations} isLoading={isLoading} />

      {variations.length > 0 && selectedSet && (
        <div className="scheduling-container">
          <h4>2. Programar Campaña</h4>
          <p>Se creará una secuencia de publicaciones para los <strong>{selectedSet.groups.length} grupos</strong> de "<strong>{selectedSet.name}</strong>".</p>
          <div className="schedule-controls">
            <div className="schedule-control-item">
              <label>Hora de Inicio:</label>
              <Datetime value={startTime} onChange={date => setStartTime(date)} />
            </div>
            <div className="schedule-control-item">
              <label>Intervalo (minutos):</label>
              <NumericInput min={1} max={1440} value={interval} onChange={(value) => setInterval(value)} className="numeric-input" style={false} />
            </div>
          </div>
          <button onClick={handleSchedule} disabled={isLoading} className="schedule-button">
            {isLoading ? 'Programando...' : `🚀 Programar ${selectedSet.groups.length} Publicaciones`}
          </button>
        </div>
      )}
    </div>
  );
}

export default GeneratorForm;