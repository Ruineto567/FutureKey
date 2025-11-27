// backend/src/middlewares/auth.middleware.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async function authRequired(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Formato de token inválido' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token ausente' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userId = payload.sub || payload.id;

    if (!userId) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    const user = await User.findById(userId).select('_id email plan googleTokens');
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    req.user = user;
    next();
  } catch (e) {
    const msg = e.name === 'TokenExpiredError'
      ? 'Token expirado'
      : 'Token inválido';

    return res.status(401).json({ message: msg });
  }
}
