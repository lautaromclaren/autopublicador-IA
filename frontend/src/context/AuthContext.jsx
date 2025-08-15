// src/context/AuthContext.jsx

import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. CREAMOS EL CONTEXTO
const AuthContext = createContext();

// 2. CREAMOS EL PROVEEDOR DEL CONTEXTO (EL COMPONENTE QUE ENVOLVERÁ LA APP)
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Esta función se ejecuta cada vez que la aplicación se carga
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Si hay un token, podríamos verificarlo contra el backend para obtener datos del usuario.
          // Por ahora, asumiremos que si hay token, el usuario está autenticado.
          // En una versión más avanzada, haríamos una llamada a /api/auth/me
          setIsAuthenticated(true);
          // setUser({ email: 'usuario@ejemplo.com' }); // Ejemplo de cómo estableceríamos el usuario
        } catch (error) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    // Podríamos decodificar el token para obtener datos del usuario y guardarlos en el estado 'user'
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  // 3. PROVEEMOS LOS VALORES A LOS COMPONENTES HIJOS
  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

// 4. EXPORTAMOS EL CONTEXTO Y EL PROVEEDOR
export { AuthContext, AuthProvider };