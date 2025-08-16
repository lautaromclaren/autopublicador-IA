// src/App.jsx

import Header from './components/Header.jsx';
import GeneratorForm from './components/GeneratorForm.jsx';
import { useAuth } from './context/AuthContext.jsx'; // <-- Usamos el hook

function App() {
  const { user } = useAuth(); // Obtenemos la información del usuario

  return (
    <div>
      <Header />
      
      <main style={{ padding: '2rem' }}>
        {/* Mostramos un saludo personalizado si tenemos los datos del usuario */}
        <h1>Bienvenido al Panel, {user ? user.email : 'Usuario'}!</h1>
        <p>Desde aquí podrás gestionar y automatizar todo tu contenido.</p>
        
        <GeneratorForm />
      </main>
    </div>
  )
}

export default App;