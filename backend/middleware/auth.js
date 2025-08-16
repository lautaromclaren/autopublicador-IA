// backend/middleware/auth.js

const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // 1. OBTENER EL TOKEN DEL HEADER DE LA PETICIÓN
  // El frontend enviará el token en un "header" llamado 'x-auth-token'
  const token = req.header('x-auth-token');

  // 2. VERIFICAR SI NO HAY TOKEN
  if (!token) {
    return res.status(401).json({ message: 'No hay token, autorización denegada.' });
  }

  try {
    // 3. VERIFICAR SI EL TOKEN ES VÁLIDO
    // Usamos jwt.verify para decodificar el token usando nuestra clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. SI ES VÁLIDO, AÑADIMOS EL USUARIO DEL PAYLOAD A LA PETICIÓN (req)
    // Esto permite que las rutas que vienen después sepan quién es el usuario
    req.user = decoded.user;
    
    // 5. LLAMAMOS A next() PARA QUE LA PETICIÓN CONTINÚE HACIA SU RUTA FINAL
    next();
  } catch (error) {
    // Si el token no es válido (ha expirado, ha sido manipulado, etc.)
    res.status(401).json({ message: 'El token no es válido.' });
  }
}

module.exports = authMiddleware;