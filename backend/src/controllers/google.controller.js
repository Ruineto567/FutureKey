// backend/src/controllers/google.controller.js

import {
  getAuthUrl,
  exchangeCode,
  insertCalendarEvent,
} from '../services/google.service.js';

/**
 * @route   GET /api/google/auth/url
 * @desc    Retorna a URL para autenticação com Google OAuth2
 */
export async function getGoogleAuthUrl(req, res) {
  try {
    const url = await getAuthUrl();
    res.json({ url });
  } catch (e) {
    console.error('Erro ao gerar URL do Google:', e);
    res.status(500).json({ error: 'Erro ao gerar URL do Google' });
  }
}

/**
 * @route   GET /api/google/auth/callback
 * @desc    Recebe o código do Google e armazena tokens em cookie
 */
export async function googleCallback(req, res) {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).send('Código de autenticação ausente');

    const tokens = await exchangeCode(String(code));

    res.cookie('google_tokens', JSON.stringify(tokens), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });

    res.send(`
      <h1>Google conectado!</h1>
      <p>Você pode fechar esta aba e voltar ao FutureKey.</p>
    `);
  } catch (e) {
    console.error('Erro no callback do Google:', e);
    res.status(500).send('Erro: ' + e.message);
  }
}

/**
 * @route   POST /api/google/calendar
 * @desc    Cria um evento no Google Calendar usando tokens salvos
 */
export async function createCalendarMeeting(req, res) {
  try {
    const { title, datetime } = req.body;

    if (!title || !datetime) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const tokenCookie = req.cookies?.google_tokens;
    if (!tokenCookie) {
      return res.status(400).json({ error: 'Conecte o Google primeiro' });
    }

    const tokens = JSON.parse(tokenCookie);

    const startISO = new Date(datetime).toISOString();
    const endISO = new Date(new Date(datetime).getTime() + 60 * 60 * 1000).toISOString();

    const event = await insertCalendarEvent(tokens, {
      summary: title,
      startISO,
      endISO
    });

    res.status(201).json({ ok: true, event });
  } catch (e) {
    console.error('Erro ao criar evento:', e);
    res.status(500).json({ error: e.message });
  }
}
