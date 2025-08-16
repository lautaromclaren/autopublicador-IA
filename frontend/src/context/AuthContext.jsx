// src/context/AuthContext.jsx - VERSIÓN FINAL LISTA PARA DESPLIEGUE

import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Hook personalizado
export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthContext = createContext();

// =============================================================
//  CONFIGURACIÓN DINÁMICA DE API CLIENT
// =============================================================
// El baseURL ahora es inteligente:
// En producción (Vercel), usará la variable VITE_API_BASE_URL de tu .env.production.
// En desarrollo (tu máquina), usará localhost.
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: baseURL,
});

// =============================================================

// Componente Proveedor (sin cambios en su lógica interna)
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
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

  const register = async (email, password) => {
    await apiClient.post('/auth/register', { email, password });
  };

  const login = async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    const token = res.data.token;
    localStorage.setItem('token', token);
    apiClient.defaults.headers.common['x-auth-token'] = token;
    
    try {
        const userRes = await apiClient.get('/auth/me');
        setUser(userRes.data);
        setIsAuthenticated(true);
    } catch (error) {
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

  const authContextValue = { user, isAuthenticated, isLoading, login, register, logout };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };