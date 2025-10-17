import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

dotenv.config();
const app = express();
app.use(express.json());


const allowedOrigins = [
  'https://hortitechfrontend-production.up.railway.app', 
  'http://localhost:3000', 
  process.env.FRONTEND_URL, // Opcional si usas variable en Render
].filter(Boolean) as string[]; // Limpia valores undefined

// ✅ Configuración de CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // permitir peticiones del mismo servidor

    try {
      const originURL = new URL(origin).origin; // limpia puertos y barras
      if (allowedOrigins.includes(originURL)) {
        return callback(null, true);
      }
    } catch (err) {
      console.error("Error al parsear origen:", origin);
    }

    console.warn("❌ CORS bloqueado para origen:", origin);
    return callback(new Error("No permitido por CORS"));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));


// Logger
app.use(morgan('dev'));

// -----------------------------
// Importación de Routers
// -----------------------------
import invernaderoRouter from './router/invernaderoRouter';
import zonaRouter from './router/zonaRouter';
import gestionarCultivoRouter from './router/gestionarCultivoRouter';
import bitacoraRouter from './router/bitacoraRouter';
import programacionIluminacionRouter from './router/programacionIluminacionRouter';
import programacionRiegoRouter from './router/programacionRiegoRouter';
import historialRiegoRouter from './router/historialRiegoRouter';
import historialIluminacionRouter from './router/historialIluminacionRouter';
import userRouter from './router/userRouter';
import imagenRouter from './router/imagenRouter';
import authRouter from './router/authRouter';
import perfilRouter from './router/perfilRouter';
import personaRouter from './router/personaRouter';
import iluminacionRouter from './router/iluminacionRouter';
import lecturaSensorRouter from './router/lecturaSensorRouter';
import visitaRouter from './router/visitaRouter';
import notificacionRouter from './router/notificacionRouter';

// -----------------------------
// Definición de Rutas
// -----------------------------
app.use('/api/auth', authRouter);
app.use('/api/notificaciones', notificacionRouter);
app.use('/api/invernadero', invernaderoRouter);
app.use('/api/zona', zonaRouter);
app.use('/api/cultivos', gestionarCultivoRouter);
app.use('/api/bitacora', bitacoraRouter);
app.use('/api/visita', visitaRouter);
app.use('/api/programacionIluminacion', programacionIluminacionRouter);
app.use('/api/programacionRiego', programacionRiegoRouter);
app.use('/api/historialIluminacion', historialIluminacionRouter);
app.use('/api/historialRiego', historialRiegoRouter);
app.use('/api/imagen', imagenRouter);
app.use('/api/perfil', perfilRouter);
app.use('/api/persona', personaRouter);
app.use('/api/iluminacion', iluminacionRouter);
app.use('/api/lecturas', lecturaSensorRouter);
app.use('/api/users', userRouter);

// -----------------------------
// Middleware de Errores
// -----------------------------
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('DEBUG: Error global capturado:', err.stack);
  res.status(500).json({
    error: 'Algo salió mal en el servidor.',
    details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

// -----------------------------
// Crear servidor HTTP y Socket.IO
// -----------------------------
const server = createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins, // ✅ misma lista
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  const { role } = socket.handshake.query;
  if (role === 'admin') socket.join('admin');
  else if (role === 'operario') socket.join('operario');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

export { app, server, io };
