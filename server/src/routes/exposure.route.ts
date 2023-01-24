/**
 * Specifies the middleware and controller functions to call for each route
 * relating to admin users.
 */
import express from 'express';
import { isAdmin } from '../controllers/admin.middleware';
import {
  getExposureItemByID,
  patchExposureItemByID,
  deleteExposureItemByID,
  postExposureItemInDB,
  getAllExposureItems,
} from '../controllers/exposure.controller';
import { isAuthenticated } from '../controllers/auth.middleware';

const router = express.Router();

router.get('/', isAuthenticated, getAllExposureItems);

/**
 * A GET route to get exposure item with the specified id.
 */
router.get('/:exposure_id', isAuthenticated, getExposureItemByID);

/**
 * A POST route to create exposure items.
 */
router.post('/', isAuthenticated, postExposureItemInDB);

/**
 * A PATCH route to edit the exposure item with the specified id.
 */
router.patch('/:exposure_id', isAuthenticated, patchExposureItemByID);

/**
 * A DELETE route to delete the exposure item with the specified id.
 */
router.delete(
  '/:exposure_id',
  isAuthenticated,
  isAdmin,
  deleteExposureItemByID,
);

export default router;
