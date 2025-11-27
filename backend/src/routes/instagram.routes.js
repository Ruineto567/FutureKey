import express from 'express';
import {
  listInstagramUsers,
  getInstagramUser,
  updateInstagramUser,
  seedInstagramData,
  getInstagramAnalytics,
} from '../controllers/instagram.controller.js';

const router = express.Router();

router.get('/search', listInstagramUsers);
router.get('/analytics/:username', getInstagramAnalytics);
router.get('/:username', getInstagramUser);
router.put('/:username', updateInstagramUser);
router.post('/seed', seedInstagramData);

export default router;
