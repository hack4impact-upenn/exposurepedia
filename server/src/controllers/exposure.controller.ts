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
  getAllExposureItemsFromDB,
  getAllDisorderItemsFromDB,
  getAllFormatItemsFromDB,
  getAllInterventionTypeItemsFromDB,
  getAllKeywordItemsFromDB,
  getFilteredExposureItemsFromDB,
  getFilteredKeywordsFromDB,
} from '../services/exposure.service';
import { Disorder } from '../models/disorder.model';
import { ExposureItem } from '../models/exposureItem.model';
import { Format } from '../models/format.model';
import { InterventionType } from '../models/interventionType.model';
import { Keyword } from '../models/keyword.model';

/**
 * Gets all disorders.
 */
const getAllDisorders = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  getAllDisorderItemsFromDB()
    .then((items) => {
      res.status(StatusCode.OK).send(items);
    })
    .catch(() => {
      next(ApiError.internal('Unable to retrieve disorder items'));
    });
};

const getAllKeywords = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  getAllKeywordItemsFromDB()
    .then((items) => {
      res.status(StatusCode.OK).send(items);
    })
    .catch(() => {
      next(ApiError.internal('Unable to retrieve keyword items'));
    });
};

const getAllInterventionTypes = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  getAllInterventionTypeItemsFromDB()
    .then((items) => {
      res.status(StatusCode.OK).send(items);
    })
    .catch(() => {
      next(ApiError.internal('Unable to retrieve intervention type items'));
    });
};

const getAllFormats = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  getAllFormatItemsFromDB()
    .then((items) => {
      res.status(StatusCode.OK).send(items);
    })
    .catch(() => {
      next(ApiError.internal('Unable to retrieve format items'));
    });
};

/**
 * Gets all exposure items. Upon success, returns the items with 200 OK status code.
 */
const getAllExposureItems = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  getAllExposureItemsFromDB()
    .then((items) => {
      res.status(StatusCode.OK).send(items.slice(10));
    })
    .catch(() => {
      next(ApiError.internal('Unable to retrieve exposure items'));
    });
};

/**
 * Gets exposure items by given filter. Upon success, returns the items with 200 OK status code.
 */
const getFilteredExposureItems = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const {
    disorders,
    formats,
    interventionTypes,
    isAdultAppropriate,
    isChildAppropriate,
    keywords,
    isLinkBroken,
    isApproved,
    query,
  } = req.body;

  if (
    disorders == null ||
    formats == null ||
    interventionTypes == null ||
    isAdultAppropriate == null ||
    isChildAppropriate == null ||
    keywords == null ||
    isLinkBroken == null ||
    isApproved == null
  ) {
    next(
      ApiError.missingFields([
        'disorders',
        'formats',
        'interventionTypes',
        'isAdultAppropriate',
        'isChildAppropriate',
        'keywords',
        'isLinkBroken',
        'isApproved',
        'query',
      ]),
    );
    return;
  }

  try {
    const exposureItems = await getFilteredExposureItemsFromDB(
      disorders,
      formats,
      interventionTypes,
      isAdultAppropriate,
      isChildAppropriate,
      keywords,
      isLinkBroken,
      isApproved,
      query,
    );
    res.status(StatusCode.OK).json(exposureItems);
  } catch (err) {
    next(ApiError.internal('Unable to retrieve exposure items'));
  }
};

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
  console.log('ELLOO');
  console.log(item.disorders);
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

/**
 * Filters keywords
 */
const getFilteredKeywords = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { query } = req.body;
  try {
    const keywords = await getFilteredKeywordsFromDB(query);
    res.status(StatusCode.OK).json(keywords);
  } catch (err) {
    next(ApiError.internal('Unable to retrieve keywords'));
  }
};

export {
  getAllExposureItems,
  getExposureItemByID,
  getAllDisorders,
  getAllKeywords,
  getAllInterventionTypes,
  getAllFormats,
  getFilteredExposureItems,
  patchExposureItemByID,
  deleteExposureItemByID,
  postExposureItemInDB,
  getFilteredKeywords,
};
