/**
 * Controller function for contact us through email.
 */
import express from 'express';
import StatusCode from '../util/statusCode';
import { emailForContact } from '../services/mail.service';
import ApiError from '../util/apiError';

/**
 * A controller function to send an email for contact us.
 */
const contactUsEmail = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { name, email, message } = req.body;
  if (!email) {
    next(ApiError.missingFields(['email']));
    return;
  }
  const lowercaseEmail = email.toLowerCase();

  // Send the email and return an appropriate response
  emailForContact(name, lowercaseEmail, message)
    .then(() =>
      res.status(StatusCode.OK).send({
        message: `Email sent.`,
      }),
    )
    .catch(() => {
      next(ApiError.internal('Failed to send email.'));
    });
};

export default contactUsEmail;
