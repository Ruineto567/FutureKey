// backend/src/routes/auth.routes.js

import { Router } from 'express';
import { register, login, getUserByEmail } from '../controllers/auth.controller.js';
// import { validateRegister, validateLogin } from '../middlewares/validators.js'; (opcional)
// import asyncHandler from '../utils/asyncHandler.js'; (opcional)

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registrar novo usuário
 */
router.post('/register', register); // Adicionar validação e tratamento se disponível

/**
 * @route   POST /api/auth/login
 * @desc    Login do usuário
 */
router.post('/login', login); // idem

/**
 * @route   GET /api/auth/user
 * @desc    Buscar usuǭrio por email
 * @query   email
 */
router.get('/user', getUserByEmail);

export default router;
