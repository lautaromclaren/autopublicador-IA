// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; // 1. Importamos las herramientas de enrutamiento

import App from './App.jsx';
import LoginPage from './pages/LoginPage.jsx';     // 2. Importamos nuestras nuevas páginas
import RegisterPage from './pages/RegisterPage.jsx';

// 3. CREAMOS NUESTRO ENRUTADOR
const router = createBrowserRouter([
  {
    path: "/", // Cuando el usuario visite la ruta raíz...
    element: <App />, // ...mostraremos el componente App (nuestro dashboard principal).
  },
  {
    path: "/login", // Cuando el usuario visite /login...
    element: <LoginPage />, // ...mostraremos el componente LoginPage.
  },
  {
    path: "/register", // Cuando el usuario visite /register...
    element: <RegisterPage />, // ...mostraremos el componente RegisterPage.
  },
]);

// 4. LE DECIMOS A REACT QUE USE NUESTRO ENRUTADOR
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);