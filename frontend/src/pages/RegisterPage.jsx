// src/pages/RegisterPage.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css'; // <-- 1. IMPORTAMOS EL MISMO ARCHIVO CSS

function RegisterPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await register(formData.email, formData.password);
      setSuccess('¡Usuario registrado con éxito! Redirigiendo al login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error en el registro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 2. APLICAMOS LAS MISMAS CLASES CSS PARA CONSISTENCIA
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h2>Crear Cuenta</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email" id="email" value={formData.email}
              onChange={handleChange} required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password" id="password" value={formData.password}
              onChange={handleChange} required minLength="6"
            />
          </div>
          
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <button type="submit" disabled={isLoading} className="auth-button">
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        <p className="auth-link">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;