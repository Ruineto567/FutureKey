// backend/src/server.js

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.routes.js';
import meetingsRoutes from './routes/meeting.routes.js';
import googleRoutes from './routes/google.routes.js';
import instagramRoutes from './routes/instagram.routes.js';

const app = express();

// Configuração de CORS com fallback
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: [CLIENT_URL],
  credentials: true
}));

app.use(cookieParser());
app.use(express.json()); // ✅ Agora vem ANTES das rotas

// Rotas principais
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingsRoutes);
app.use('/api/google', googleRoutes);
app.use('/api/instagram', instagramRoutes); // ✅ Agora está no lugar certo!

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro interno:', err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Conexão com o MongoDB
const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/futurekey';

mongoose.connect(MONGO)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 API rodando em http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Falha ao conectar no MongoDB:', err.message);
    process.exit(1);
  });
