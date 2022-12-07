/**
 * Specifies the middleware and controller functions to call for each route
 * relating to admin users.
 */
import express from 'express';
import contactUsEmail from '../controllers/contact.controller';

const router = express.Router();

/**
 * A POST route to send a password reset email to a user. Expects a JSON body
 * with the following fields:
 * - email (string) - The email of the user
 */
router.post('/', contactUsEmail);

export default router;
