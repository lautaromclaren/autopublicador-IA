// src/App.jsx

import Header from './components/Header.jsx';
import GeneratorForm from './components/GeneratorForm.jsx';

function App() {
  return (
    <div>
      <Header />
      
      <main style={{ padding: '2rem' }}>
        <h1>Panel de Control</h1>
        <p>Bienvenido a la herramienta que potenciará tus redes sociales.</p>
        
        <GeneratorForm />
      </main>
    </div>
  )
}

export default App;