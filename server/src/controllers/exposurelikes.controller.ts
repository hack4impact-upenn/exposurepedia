/* eslint-disable camelcase */
/**
 * All the controller functions containing the logic for routes relating to
 * admin users such as getting all users, deleting users and upgrading users.
 */
import express from 'express';
import ApiError from '../util/apiError';
import { getUserByEmail } from '../services/user.service';
import StatusCode from '../util/statusCode';
import {
  createLike,
  getLikesByExposureItem,
  removeLike,
} from '../services/likes.service';

/**
 * Get the count of likes for an exposure item.
 */
const getLikes = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { exposure_id } = req.params;
  if (!exposure_id) {
    next(ApiError.missingFields(['exposure_id']));
    return 0;
  }

  getLikesByExposureItem(exposure_id)
    .then((likeCount) => {
      res.send(likeCount.toString());
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch((e) => {
      next(ApiError.internal('Unable to retrieve likes'));
    });
};

const postLike = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { exposure_id, user_email } = req.params;
  const user = await getUserByEmail(user_email);
  const user_id = user?.id;
  if (!exposure_id || !user_id) {
    next(ApiError.missingFields(['exposure_id', 'user_email']));
    return;
  }

  createLike(exposure_id, user_id)
    .then(() => {
      res.sendStatus(StatusCode.OK);
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch((e) => {
      next(ApiError.internal('Unable to post like'));
    });
};

const deleteLike = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { exposure_id, user_email } = req.params;
  const user = await getUserByEmail(user_email);
  const user_id = user?.id;
  if (!exposure_id || !user_id) {
    next(ApiError.missingFields(['exposure_id', 'user_email']));
    return;
  }

  removeLike(exposure_id, user_id)
    .then(() => {
      res.sendStatus(StatusCode.OK);
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch((e) => {
      next(ApiError.internal('Unable to delete like'));
    });
};

export { getLikes, postLike, deleteLike };
