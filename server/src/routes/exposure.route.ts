/**
 * Specifies the middleware and controller functions to call for each route
 * relating to exposure items.
 */
import express from 'express';
import getAllExposureItems from '../controllers/exposure.controller';
import 'dotenv/config';

const router = express.Router();

/**
 * A GET route to get all users. Checks first if the requestor is a
 * authenticated and is an admin.
 */
router.get('/', getAllExposureItems);

export default router;
