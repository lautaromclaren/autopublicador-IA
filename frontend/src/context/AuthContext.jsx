// src/context/AuthContext.jsx - VERSIÓN FINAL CON REFETCH

import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthContext = createContext();

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
export const apiClient = axios.create({
  baseURL: baseURL,
});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
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
        console.error("Fallo al buscar usuario, token inválido.", err);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const register = async (email, password) => {
    await apiClient.post('/auth/register', { email, password });
  };
  
  const login = async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    await fetchUser(); // Llama a fetchUser para actualizar el estado después del login
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete apiClient.defaults.headers.common['x-auth-token'];
    setUser(null);
    setIsAuthenticated(false);
  };
  
  // ¡NUEVA FUNCIÓN! La expondremos para que otros componentes la puedan llamar
  const refetchUser = () => {
    setIsLoading(true); // Opcional: mostrar un estado de carga mientras se refresca
    fetchUser();
  };

  const authContextValue = { user, isAuthenticated, isLoading, login, register, logout, refetchUser };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };