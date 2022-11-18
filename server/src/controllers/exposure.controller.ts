// wasn't sure what to name this controller? pls rename if needed

/**
 * All the controller functions containing the logic for routes relating to
 * admin users such as getting all users, deleting users and upgrading users.
 */
import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import {
  getAllExposureItemsFromDB,
  ExposureItemFilters,
} from '../services/exposureItem.service';

type ExposureItemQuery = {
  q: string;
  f: ExposureItemFilters;
};

/**
 * Get all exposure items from the database. Upon success, send the a list of all exposure items in the res body with 200 OK status code.
 * This expects a query to be parsed by qs of the form "q=SEARCH_QUERY&f[disorders][]=a&f[formats][]=b&..." etc.
 */
const getAllExposureItems = async (
  req: express.Request<ExposureItemQuery>,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { q } = req.query;
  const { f } = req.query;

  let query: string;
  let filters: ExposureItemFilters;

  // validate search query
  if (typeof q !== 'string') {
    if (!q) {
      query = '';
    } else {
      next(ApiError.badRequest('Invalid search query'));
      return;
    }
  } else {
    query = q;
  }

  // validate filters
  if (typeof f === 'string' || Array.isArray(f)) {
    next(ApiError.badRequest('Invalid filter query'));
    return;
  }
  if (f === undefined) {
    filters = {};
  } else {
    filters = f;
  }

  // eslint-disable-next-line consistent-return
  return (
    getAllExposureItemsFromDB(query, filters)
      .then((exposureItemList) => {
        res.status(StatusCode.OK).send(exposureItemList);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch(() => {
        next(ApiError.internal('Unable to retrieve exposure items'));
      })
  );
};

export default getAllExposureItems;
