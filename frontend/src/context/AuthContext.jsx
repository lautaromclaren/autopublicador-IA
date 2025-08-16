// src/context/AuthContext.jsx

import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthContext = createContext();

// Creamos un cliente de axios con la URL base para no repetirla
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Configuramos el token en los headers de todas las futuras peticiones de apiClient
        apiClient.defaults.headers.common['x-auth-token'] = token;
        try {
          const res = await apiClient.get('/auth/me');
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    // Esta función ahora hará la llamada a la API
    const res = await apiClient.post('/auth/login', { email, password });
    const token = res.data.token;
    localStorage.setItem('token', token);
    // Re-configuramos el header para las nuevas peticiones
    apiClient.defaults.headers.common['x-auth-token'] = token;
    
    // Obtenemos los datos del usuario inmediatamente después del login
    try {
        const userRes = await apiClient.get('/auth/me');
        setUser(userRes.data);
        setIsAuthenticated(true);
    } catch (error) {
        // Limpiamos en caso de error
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete apiClient.defaults.headers.common['x-auth-token'];
    setUser(null);
    setIsAuthenticated(false);
  };

  const authContextValue = { user, isAuthenticated, isLoading, login, logout };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider, apiClient };