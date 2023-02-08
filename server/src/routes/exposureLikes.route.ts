/**
 * Specifies the middleware and controller functions to call for each route
 * relating to admin users.
 */
import express from 'express';
import { isAuthenticated } from '../controllers/auth.middleware';
import {
  getLikes,
  postLike,
  deleteLike,
} from '../controllers/exposurelikes.controller';

const router = express.Router();

router.get('/:exposure_id', isAuthenticated, getLikes);
router.post('/:exposure_id/:user_email', isAuthenticated, postLike);
router.delete('/:exposure_id/:user_email', isAuthenticated, deleteLike);

export default router;
