// src/components/AIResponse.jsx

function AIResponse({ content, isLoading }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    alert('¡Texto copiado al portapapeles!');
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <h4>Generando...</h4>
        <p>La IA está creando tu publicación. Por favor, espera.</p>
      </div>
    );
  }
  
  // Si no está cargando y no hay contenido, no muestra nada.
  if (!content) {
    return null;
  }

  return (
    <div style={styles.container}>
      <h4>Contenido Generado por IA:</h4>
      <textarea
        readOnly
        value={content}
        style={styles.textarea}
      />
      <button onClick={handleCopy} style={styles.button}>
        Copiar Texto
      </button>
    </div>
  );
}

// Estilos para mantener el código limpio
const styles = {
  container: {
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ddd',
    borderRadius: '8px'
  },
  textarea: {
    width: '100%',
    minHeight: '150px',
    padding: '0.5rem',
    fontSize: '1rem',
    marginBottom: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  button: {
    padding: '0.8rem 1.5rem',
    fontSize: '1rem',
    cursor: 'pointer'
  }
};

export default AIResponse;