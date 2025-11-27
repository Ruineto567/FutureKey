// backend/src/routes/meeting.routes.js

import { Router } from 'express';
import authRequired from '../middlewares/auth.middleware.js';
// import Meeting from '../models/Meeting.js'; // Ative quando o modelo estiver disponível

const router = Router();

/**
 * @route   GET /api/meetings
 * @desc    Lista reuniões do usuário autenticado
 * @access  Privado
 */
router.get('/', authRequired, async (req, res) => {
  try {
    // const meetings = await Meeting.find({ user: req.user._id });
    // res.json(meetings);

    res.json([]); // Placeholder
  } catch (err) {
    console.error('Erro ao buscar reuniões:', err.message);
    res.status(500).json({ error: 'Erro ao buscar reuniões' });
  }
});

export default router;
