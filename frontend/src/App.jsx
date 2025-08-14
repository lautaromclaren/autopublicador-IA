// src/App.jsx

import Header from './components/Header.jsx'; // 1. Importamos el componente

function App() {
  return (
    <div>
      <Header /> {/* 2. Usamos nuestro componente como si fuera una etiqueta HTML */}
      
      <main style={{ padding: '2rem' }}>
        <h1>Panel de Control</h1>
        <p>Bienvenido a la herramienta que potenciará tus redes sociales.</p>
      </main>
    </div>
  )
}

export default App;