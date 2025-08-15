// src/pages/RegisterPage.jsx

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Para redirigir al usuario

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Hook para la navegación

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    // Validación simple
    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        email,
        password
      });

      setSuccess(response.data.message + ' Redirigiendo al login...');
      
      // Si el registro es exitoso, redirigimos al usuario a la página de login después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      // Si el backend devuelve un error (ej: usuario ya existe), lo mostramos
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Ocurrió un error en el registro. Inténtalo de nuevo.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '5rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Crear Cuenta</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
          />
        </div>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <button type="submit" style={{ width: '100%', padding: '0.8rem', fontSize: '1rem' }}>
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;