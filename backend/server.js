//Importar todas las librerías necesarias
require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const path = require('path');
const connectDB = require("./config/db"); // Conexión a MongoDB
const mongoose = require('mongoose');

// Crear la aplicación Express y conectar a la base de datos MongoDB
const app = express();
connectDB();

//Middleware para procesar datos JSON en las peticiones
app.use(express.json());

// Middleware CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Servir archivos estáticos (imágenes de ejercicios, PDFs de guías, etc.)
// Solo forzar descarga para guías PDF, las imágenes de ejercicios se muestran en el navegador
app.use('/uploads', (req, res, next) => {
  if (req.path.includes('/guias/')) {
    const filename = path.basename(req.path);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  }
  next();
}, express.static(path.join(__dirname, 'uploads')));

//Importar las rutas (solo usuarios y autenticación en esta fase)
const rutasUsuarios = require('./routes/userRoutes');
const rutasAutenticacion = require('./routes/authRoutes');
const rutasClases = require('./routes/claseRoutes');
const rutasEjercicios = require('./routes/ejercicioRoutes');
const rutasGuias = require('./routes/guiaRoutes');
const rutasStats = require('./routes/statsRoutes');
const rutasExport = require('./routes/exportRoutes');
const rutasEmail = require('./routes/emailRoutes');

//Configurar las rutas de la API
app.use('/api/users', rutasUsuarios);
app.use('/api/auth', rutasAutenticacion);
app.use('/api/clases', rutasClases);
app.use('/api/ejercicios', rutasEjercicios);
app.use('/api/guias', rutasGuias);
app.use('/api/stats', rutasStats);
app.use('/api/export', rutasExport);
app.use('/api/email', rutasEmail);

// En desarrollo, el frontend corre en Vite (puerto 3000)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend-react/dist')));
  
  app.get('*', (peticion, respuesta) => {
    if (!peticion.path.startsWith('/api')) {
      respuesta.sendFile(path.join(__dirname, '../frontend-react/dist/index.html'));
    } else {
      respuesta.status(404).json({ message: 'Endpoint no encontrado' });
    }
  });
} else {
  // En desarrollo, solo manejar rutas de API no encontradas
  app.use('*', (peticion, respuesta) => {
    if (peticion.path.startsWith('/api')) {
      respuesta.status(404).json({ message: 'Endpoint de API no encontrado' });
    } else {
      respuesta.status(404).json({ message: 'El frontend corre en http://localhost:3000' });
    }
  });
}

//Configurar el puerto del servidor 
const PORT = process.env.PORT || 5001;

// Arrancar el servidor y manejar posibles errores
const servidor = app.listen(PORT, () => {
  console.log(` Servidor Fase 1 iniciado en http://localhost:${PORT}`);
});

// Manejar error si el PORT ya está ocupado
servidor.on('error', (error) => {
  if (error && error.code === 'EADDRINUSE') {
    console.error(` El PORT ${PORT} ya está en uso.`);
    console.error(` Puedes cambiar el PORT o cerrar el proceso que lo usa`);
    // Esto lo añado porque es un problema que me pasaba a mí y lo tenía que utilizar
    // Para conocer más rápido el error 
    console.error(` Buscar proceso: netstat -ano | findstr :${PORT}`);   
    process.exit(1);
  }
  throw error;
});

// Funciones para cerrar el servidor correctamente (graceful shutdown)
//Solucionamos problemas de reinicios o conexiones abiertas al cerrar el servidor con nodemon o Ctrl+C, que me daban errores al volver a iniciar el servidor
const cerrarServidor = async (señal) => {
  console.log(`Recibida señal ${señal}. Cerrando servidor...`);
  servidor.close(async () => {
    console.log(' Servidor cerrado correctamente.');
    try {
      await mongoose.connection.close();
      console.log(' Conexión a MongoDB cerrada.');
    } catch (error) {
      console.error('Error al cerrar MongoDB:', error.message);
    }
    
    if (señal === 'SIGUSR2') {
      // Permitir que nodemon reinicie el servidor
      process.kill(process.pid, 'SIGUSR2');
    } else {
      process.exit(0);
    }
  });
};

// Escuchar señales del sistema para cerrar correctamente. Buscado para solucionar errores de cierre de procesos
// que me daban problemas al volver a iniciar el servidor con nodemon
process.once('SIGUSR2', () => cerrarServidor('SIGUSR2')); //nodemon reiniciar el servidor sin errores
process.on('SIGINT', () => cerrarServidor('SIGINT')); //cerrar bien la conexión

// Autor: Iván Pons Martínez
// UltimateGym - Backend principal
// Proyecto SPA + API RESTful
// ----------------------------------------