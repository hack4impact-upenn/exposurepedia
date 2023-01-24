/**
 * All the functions for interacting with exposure data in the MongoDB database
 */
import { Disorder } from '../models/disorder.model';
import { ExposureItem } from '../models/exposureItem.model';
import { Format } from '../models/format.model';
import { InterventionType } from '../models/interventionType.model';
import { Keyword } from '../models/keyword.model';

/**
 * Get all exposure items from the DB
 * @returns All exposure items in the DB
 */
const getAllExposureItemsFromDB = async () => {
  return ExposureItem.aggregate([
    {
      $lookup: {
        from: 'disorders',
        localField: 'disorders',
        foreignField: '_id',
        as: 'disorders',
      },
    },
    {
      $lookup: {
        from: 'formats',
        localField: 'formats',
        foreignField: '_id',
        as: 'formats',
      },
    },
  ]).exec();
};

/**
 * Gets filtered exposure items from DB
 */
const getFilteredExposureItemsFromDB = async (
  disorders: string[],
  formats: string[],
  interventionTypes: string[],
  isAdultAppropriate: boolean,
  isChildAppropriate: boolean,
  keywords: string[],
) => {
  const match: any = {};

  if (disorders.length !== 0) {
    match.disorders = { $elemMatch: { name: { $in: disorders } } };
  }

  if (formats.length !== 0) {
    match.formats = { $elemMatch: { name: { $in: formats } } };
  }

  if (interventionTypes.length !== 0) {
    match.interventionTypes = {
      $elemMatch: { name: { $in: interventionTypes } },
    };
  }

  if (isAdultAppropriate) {
    match.isAdultAppropriate = true;
  }

  if (isChildAppropriate) {
    match.isChildAppropriate = true;
  }

  if (keywords.length !== 0) {
    match.keywords = { $elemMatch: { name: { $in: keywords } } };
  }

  return ExposureItem.aggregate(
    Object.keys(match).length > 0
      ? [
          {
            $lookup: {
              from: 'disorders',
              localField: 'disorders',
              foreignField: '_id',
              as: 'disorders',
            },
          },
          {
            $lookup: {
              from: 'formats',
              localField: 'formats',
              foreignField: '_id',
              as: 'formats',
            },
          },
          {
            $lookup: {
              from: 'interventionTypes',
              localField: 'interventionTypes',
              foreignField: '_id',
              as: 'interventionTypes',
            },
          },
          {
            $lookup: {
              from: 'keywords',
              localField: 'keywords',
              foreignField: '_id',
              as: 'keywords',
            },
          },
          {
            $match: match,
          },
        ]
      : [
          {
            $lookup: {
              from: 'disorders',
              localField: 'disorders',
              foreignField: '_id',
              as: 'disorders',
            },
          },
          {
            $lookup: {
              from: 'formats',
              localField: 'formats',
              foreignField: '_id',
              as: 'formats',
            },
          },
        ],
  )
    .limit(20)
    .exec();
};

/**
 * Get exposure item from DB given id string.
 * @param id The id of the exposure item
 * @returns The item in the DB with the specified id
 */
const getExposureItemFromDB = async (id: string) => {
  const item = await ExposureItem.findById(id).exec();
  return item;
};

/**
 * Creates the exposure item from the DB with the specified id
 * @param exposureItem The new exposure item
 * @returns the new item
 */
const createExposureItemInDB = async (
  name: string,
  disorders: string[],
  formats: string[],
  interventionTypes: string[],
  isAdultAppropriate: boolean,
  isChildAppropriate: boolean,
  keywords: string[],
  modifications: string,
  link: string,
) => {
  // updateOne does not return documents, so must update/create and then find
  keywords.forEach(async (keyword) => {
    await Keyword.updateOne(
      { name: keyword },
      { name: keyword },
      { upsert: true },
    ).exec();
  });

  const newDisorders = await Disorder.find({
    name: { $in: disorders },
  }).exec();
  const newFormats = await Format.find({
    name: { $in: formats },
  }).exec();
  const newInterventionTypes = await InterventionType.find({
    name: { $in: interventionTypes },
  }).exec();
  const newKeywords = await Keyword.find({
    name: { $in: keywords },
  }).exec();

  const newExposureItem = new ExposureItem({
    name,
    disorders: newDisorders,
    formats: newFormats,
    interventionTypes: newInterventionTypes,
    isAdultAppropriate,
    isChildAppropriate,
    keywords: newKeywords,
    modifications,
    link,
    isLinkBroken: false,
    isApproved: false,
  });
  const item = await newExposureItem.save();
  return item;
};

/**
 * Deletes the exposure item from the DB with the specified id
 * @param id The id of the exposure item to delete
 * @returns The deleted exposure item
 */
const deleteExposureItemFromDB = async (id: string) => {
  const item = await ExposureItem.findByIdAndDelete(id).exec();
  return item;
};

export {
  getAllExposureItemsFromDB,
  getExposureItemFromDB,
  getFilteredExposureItemsFromDB,
  deleteExposureItemFromDB,
  createExposureItemInDB,
};
