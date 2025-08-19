// src/routes/DashboardLayout.jsx

import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

// Este componente define la estructura visual común para las páginas autenticadas.
function DashboardLayout() {
  return (
    <div>
      <Header />
      <Outlet /> {/* El Outlet renderizará la página anidada (App, HistoryPage, etc.) */}
    </div>
  );
}

export default DashboardLayout;