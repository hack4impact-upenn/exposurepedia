/**
 * Specifies the middleware and controller functions to call for each route
 * relating to admin users.
 */
import express from 'express';
import 'dotenv/config';
import {
  createHierarchyHandler,
  getUserHierarchies,
  updateHierarchyHandler,
  deleteHierarchyHandler,
  getHierarchy,
} from '../controllers/hierarchy.controller';

const router = express.Router();

/**
 * A GET route to get a list of hierarchies created by a user.
 * Expects the following fields in the URL:
 * user_id (number) - The id of the user
 */
router.get('/:user_email', getUserHierarchies);

/**
 * A GET route to populate the View Hierarchy page for the hierarchy with the specified hierarchy_id
 * Expects user_id and hierarchy_id
 * Returns a hierarchy with fields: id, user_id, title, exposure_ids, updated_at
 */
router.get('/:user_email/:hierarchy_id', getHierarchy);

/**
 * A POST route to create a hierarchy with the fields specified from the request body.
 * Expects user_id, title, description
 * Returns success/failure message
 */
router.post('/', createHierarchyHandler);

/**
 * A PATCH route to edit a hierarchy
 * Expects user_id, hierarchy_id (query params) and user_id, title, description, exposure_ids (body params)
 * Returns success/failure message
 */
router.patch('/:user_email/:hierarchy_id', updateHierarchyHandler);

/**
 * A DELETE route to delete a hierarchy and all rows in in_hierarchy table that have the same hierarchy_id
 * Expects hierarchy_id
 * Returns success/failure message
 */
router.delete('/:hierarchy_id', deleteHierarchyHandler);

export default router;
