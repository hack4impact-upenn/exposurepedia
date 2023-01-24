/**
 * All the controller functions containing the logic for routes relating to
 * exposure items.
 */
import express from 'express';
import ApiError from '../util/apiError';
import StatusCode from '../util/statusCode';
import {
  getExposureItemFromDB,
  deleteExposureItemFromDB,
  createExposureItemInDB,
} from '../services/exposure.service';
import { Disorder } from '../models/disorder.model';
import { ExposureItem } from '../models/exposureItem.model';
import { Format } from '../models/format.model';
import { InterventionType } from '../models/interventionType.model';
import { Keyword } from '../models/keyword.model';

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
      res.status(StatusCode.OK).send(item);
    })
    .catch(() => {
      next(ApiError.internal('Unable to retrieve exposure item'));
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
  const item = req.body;
  if (
    item.name == null ||
    item.disorders == null ||
    item.formats == null ||
    item.interventionTypes == null ||
    item.isAdultAppropriate == null ||
    item.isChildAppropriate == null ||
    item.keywords == null
  ) {
    next(
      ApiError.missingFields([
        'name',
        'disorders',
        'formats',
        'interventionTypes',
        'isAdultAppropriate',
        'isChildAppropriate',
        'keywords',
      ]),
    );
    return;
  }
  if (item.modifications == null) {
    item.modifications = '';
  }
  if (item.link == null) {
    item.link = '';
  }

  try {
    const exposureItem = await createExposureItemInDB(
      item.name,
      item.disorders,
      item.formats,
      item.interventionTypes,
      item.isAdultAppropriate,
      item.isChildAppropriate,
      item.keywords,
      item.modifications,
      item.link,
    );
    res.status(StatusCode.OK).json(exposureItem);
  } catch (err) {
    next(ApiError.internal('Unable to create exposure item'));
  }
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
  if (!id) {
    next(ApiError.missingFields(['exposureitem_id']));
    return;
  }

  const exposureItem = await ExposureItem.findOne({
    _id: id,
  }).exec();
  if (!exposureItem) {
    throw new Error('Invalid exposure item');
  }

  if (updatedItem.disorders !== undefined) {
    const newDisorders = await Disorder.find({
      name: { $in: updatedItem.disorders },
    }).exec();
    exposureItem.disorders = newDisorders;
  }
  if (updatedItem.formats !== undefined) {
    const newFormats = await Format.find({
      name: { $in: updatedItem.formats },
    }).exec();
    exposureItem.formats = newFormats;
  }
  if (updatedItem.interventionTypes !== undefined) {
    const newInterventionTypes = await InterventionType.find({
      name: { $in: updatedItem.interventionTypes },
    }).exec();
    exposureItem.interventionTypes = newInterventionTypes;
  }
  if (updatedItem.keywords !== undefined) {
    updatedItem.keywords.forEach(async (keyword: string) => {
      await Keyword.updateOne(
        { name: keyword },
        { name: keyword },
        { upsert: true },
      ).exec();
    });
    const newKeywords = await Keyword.find({
      name: { $in: updatedItem.keywords },
    }).exec();
    exposureItem.keywords = newKeywords;
  }

  if (updatedItem.name !== undefined) exposureItem.name = updatedItem.name;
  if (updatedItem.isAdultAppropriate !== undefined)
    exposureItem.isAdultAppropriate = updatedItem.isAdultAppropriate;
  if (updatedItem.isChildAppropriate !== undefined)
    exposureItem.isChildAppropriate = updatedItem.isChildAppropriate;
  if (updatedItem.link !== undefined) exposureItem.link = updatedItem.link;
  if (updatedItem.modifications !== undefined)
    exposureItem.modifications = updatedItem.modifications;
  if (updatedItem.isLinkBroken !== undefined)
    exposureItem.isLinkBroken = updatedItem.isLinkBroken;
  if (updatedItem.isApproved !== undefined)
    exposureItem.isApproved = updatedItem.isApproved;

  try {
    await exposureItem.save();
    res.sendStatus(StatusCode.OK);
  } catch (err) {
    next(ApiError.internal('Unable to update the exposure item'));
  }
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

export {
  getExposureItemByID,
  patchExposureItemByID,
  deleteExposureItemByID,
  postExposureItemInDB,
};
