// src/main.jsx - VERSIÓN FINAL CON HISTORIAL

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx'; 

import App from './App.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx'; // <-- 1. IMPORTAMOS LA NUEVA PÁGINA

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      { path: "/", element: <App /> },
      { path: "/history", element: <HistoryPage /> } // <-- 2. AÑADIMOS LA RUTA PROTEGIDA
    ]
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);