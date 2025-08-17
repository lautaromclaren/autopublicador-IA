// src/App.jsx

import Header from './components/Header.jsx';
import GeneratorForm from './components/GeneratorForm.jsx';
import TargetGroups from './components/TargetGroups.jsx';
import { useAuth } from './context/AuthContext.jsx';
import './App.css';

function App() {
  const { user } = useAuth();

  return (
    <div>
      <Header />
      
      <main className="main-container">
        <h1>Bienvenido al Panel, {user ? user.email : 'Usuario'}!</h1>
        <p>Desde aquí podrás gestionar y automatizar todo tu contenido.</p>
        
        <div className="dashboard-layout" style={{ marginTop: '2rem' }}>
          <div className="generator-column">
            <GeneratorForm />
          </div>
          <div className="groups-column">
            <TargetGroups />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;