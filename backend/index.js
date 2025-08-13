// 1. Importar la librería express que acabamos de instalar
const express = require('express');

// 2. Crear una instancia de la aplicación express
const app = express();

// 3. Definir el puerto en el que nuestro servidor va a escuchar
// Usamos 3001 para que no choque con el frontend (que usará el 3000)
const PORT = 3001;

// 4. Crear una ruta de prueba
// Cuando alguien visite la dirección raíz ('/') de nuestro backend,
// le enviaremos un mensaje de texto.
app.get('/', (req, res) => {
  res.send('¡El backend del autopublicador IA está funcionando!');
});

// 5. Poner el servidor a escuchar en el puerto que definimos
// Esto es lo que efectivamente "enciende" nuestro servidor.
app.listen(PORT, () => {
  console.log(`Servidor corriendo exitosamente en el puerto http://localhost:${PORT}`);
});