// src/App.jsx

import Header from './components/Header.jsx';
import GeneratorForm from './components/GeneratorForm.jsx';
import { useAuth } from './context/AuthContext.jsx';
import './App.css'; // Importamos los estilos globales

function App() {
  const { user } = useAuth();

  return (
    <div>
      <Header />
      
      <main className="main-container">
        <h1>Bienvenido al Panel, {user ? user.email : 'Usuario'}!</h1>
        <p>Desde aquí podrás gestionar y automatizar todo tu contenido.</p>
        
        <GeneratorForm />
      </main>
    </div>
  );
}

export default App;