// backend/src/routes/google.routes.js

import { Router } from 'express';
import { google } from 'googleapis';
import authRequired from '../middlewares/auth.middleware.js';
import User from '../models/User.js';

const router = Router();

// Utilitário interno para obter OAuth2 client
function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI // Exemplo: http://localhost:4000/api/google/auth/callback
  );
}

/**
 * @route   GET /api/google/auth/url
 * @desc    Gera URL de autorização do Google
 * @access  Privado
 */
router.get('/auth/url', authRequired, async (req, res) => {
  try {
    const oauth2Client = getOAuth2Client();
    const scopes = [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/calendar'
    ];

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes,
      state: String(req.user._id)
    });

    res.json({ url });
  } catch (error) {
    console.error('Erro ao gerar URL de auth do Google:', error.message);
    res.status(500).json({ error: 'Erro ao gerar URL de autorização' });
  }
});

/**
 * @route   GET /api/google/auth/callback
 * @desc    Callback do Google para receber tokens
 * @access  Público (chamado pelo Google)
 */
router.get('/auth/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    const oauth2Client = getOAuth2Client();

    const { tokens } = await oauth2Client.getToken(code);
    const user = await User.findById(state);

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    user.googleTokens = tokens;
    await user.save();

    res.send('Conta Google conectada com sucesso! Você pode fechar esta aba.');
  } catch (error) {
    console.error('Erro no callback do Google:', error.message);
    res.status(500).json({ error: 'Erro na autenticação com o Google' });
  }
});

export default router;
