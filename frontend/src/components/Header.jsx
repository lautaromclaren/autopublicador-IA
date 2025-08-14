// src/components/Header.jsx

function Header() {
  return (
    <header style={{ 
        backgroundColor: '#1a1a1a', 
        padding: '1rem', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
      <h2 style={{ margin: 0 }}>Autopublicador IA</h2>
      <nav>
        <a href="#" style={{ color: 'white', margin: '0 10px' }}>Dashboard</a>
        <a href="#" style={{ color: 'white', margin: '0 10px' }}>Publicaciones</a>
        <a href="#" style={{ color: 'white', margin: '0 10px' }}>Mi Cuenta</a>
      </nav>
    </header>
  );
}

export default Header;