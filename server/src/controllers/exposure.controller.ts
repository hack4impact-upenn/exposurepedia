/**
 * All the controller functions containing the logic for routes relating to
 * exposure items.
 */
import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import {
  getExposureItemFromDB,
  updateExposureItemInDB,
  deleteExposureItemFromDB,
  createExposureItemInDB,
} from '../services/exposure.service';

/**
 * Gets exposure item by id. Upon success, returns the item with 200 OK status code.
 */
const getExposureItemByID = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const id = req.params.exposure_id;
  getExposureItemFromDB(id)
    .then((item) => {
      res.sendStatus(StatusCode.OK).send(item);
    })
    .catch(() => {
      next(ApiError.internal('Unable to retrieve exposure item'));
    });
};

/**
 * Updates exposure item by id. Upon success, returns 200 OK status code.
 */
const patchExposureItemByID = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const id = req.params.exposure_id;
  const updatedItem = req.body;
  updateExposureItemInDB(id, updatedItem)
    .then(() => {
      res.sendStatus(StatusCode.OK);
    })
    .catch(() => {
      next(ApiError.internal('Unable to update exposure item'));
    });
};

/**
 * Deletes exposure item by id. Upon success, returns 200 OK status code.
 */
const deleteExposureItemByID = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const id = req.params.exposure_id;
  deleteExposureItemFromDB(id)
    .then(() => {
      res.sendStatus(StatusCode.OK);
    })
    .catch(() => {
      next(ApiError.internal('Unable to delete exposure item'));
    });
};

/**
 * Creates the new item. Upon success, returns 200 OK status code.
 */
const postExposureItemInDB = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const exposureItem = await createExposureItemInDB(req.body);
    res.status(StatusCode.OK).json(exposureItem);
  } catch (err) {
    next(ApiError.internal('Unable to create exposure item'));
  }
};

export {
  getExposureItemByID,
  patchExposureItemByID,
  deleteExposureItemByID,
  postExposureItemInDB,
};
