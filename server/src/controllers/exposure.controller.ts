/**
 * All the controller functions containing the logic for routes relating to
 * exposure items.
 */
import express from 'express';
// import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import { getByID, deleteByID } from '../services/exposure.service';

/**
 *
 */
const getExposureItemByID = async (
  req: express.Request,
  res: express.Response,
  // next: express.NextFunction,
) => {
  const { id } = req.params;
  const item = await getByID(id);
  console.log(id);
  res.sendStatus(StatusCode.OK).send(item);
};

/**
 *
 */
const patchExposureItemByID = async (
  req: express.Request,
  res: express.Response,
  // next: express.NextFunction,
) => {
  const { id } = req.params;
  console.log(id);
  res.sendStatus(StatusCode.OK);
};

/**
 *
 */
const deleteExposureItemByID = async (
  req: express.Request,
  res: express.Response,
  // next: express.NextFunction,
) => {
  const { id } = req.params;
  const item = await deleteByID(id);
  console.log(id);
  res.sendStatus(StatusCode.OK).send(item);
};

export { getExposureItemByID, patchExposureItemByID, deleteExposureItemByID };
