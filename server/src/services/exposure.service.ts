/**
 * All the functions for interacting with exposure data in the MongoDB database
 */
import mongoose from 'mongoose';
import { Disorder } from '../models/disorder.model';
import { ExposureItem } from '../models/exposureItem.model';
import { Format } from '../models/format.model';
import { InterventionType } from '../models/interventionType.model';
import { Keyword } from '../models/keyword.model';

/**
 * Get all disorder items from DB
 */
const getAllDisorderItemsFromDB = async () => {
  return Disorder.distinct('name').exec();
};

/**
 * Get all disorder items from DB
 */
const getAllFormatItemsFromDB = async () => {
  return Format.distinct('name').exec();
};

/**
 * Get all disorder items from DB
 */
const getAllInterventionTypeItemsFromDB = async () => {
  return InterventionType.distinct('name').exec();
};

/**
 * Get all disorder items from DB
 */
const getAllKeywordItemsFromDB = async () => {
  return Keyword.distinct('name').exec();
};

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
  isLinkBroken: boolean,
  isApproved: boolean,
  query: string,
) => {
  const match: any = {};

  let maxCount = 20;

  if (query !== '') {
    const keywords = query.split(/\s+|,\s+/);
    const keywordsRegex = keywords.map((k) => new RegExp(`.*${k}.*`));
    match.$or = [
      { name: { $regex: query, $options: 'i' } },
      { modifications: { $regex: query, $options: 'i' } },
      { keywords: { $elemMatch: { name: { $in: keywordsRegex } } } },
    ];
  }

  if (
    disorders.length === 0 &&
    formats.length === 0 &&
    interventionTypes.length === 0 &&
    query === ''
  ) {
    maxCount = 500;
  }
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

  if (isLinkBroken) {
    match.isLinkBroken = true;
  }

  match.isApproved = isApproved;

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
              from: 'intervention types',
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
          {
            $lookup: {
              from: 'likes',
              localField: '_id',
              foreignField: 'exposure_id',
              as: 'likes',
            },
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
          {
            $lookup: {
              from: 'likes',
              localField: '_id',
              foreignField: 'exposure_id',
              as: 'likes',
            },
          },
        ],
  )
    .limit(maxCount)
    .exec();
};

/**
 * Get exposure item from DB given id string.
 * @param id The id of the exposure item
 * @returns The item in the DB with the specified id
 */
const getExposureItemFromDB = async (id: string) => {
  // const item = await ExposureItem.findById(id).exec();
  // return item;

  return ExposureItem.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
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
        from: 'intervention types',
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
  ]).exec();
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
  disorders.forEach(async (disorder) => {
    await Disorder.updateOne(
      { name: disorder },
      { name: disorder },
      { upsert: true },
    ).exec();
  });
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
  getAllDisorderItemsFromDB,
  getAllFormatItemsFromDB,
  getAllInterventionTypeItemsFromDB,
  getAllKeywordItemsFromDB,
  getFilteredExposureItemsFromDB,
  deleteExposureItemFromDB,
  createExposureItemInDB,
};
