/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
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

async function updateDisorder(
  name: string,
  subdisorderNames: string[],
  parentName: string,
) {
  // create the current disorder
  const currDisorder = await Disorder.findOneAndUpdate(
    { name },
    { name },
    { new: true, upsert: true },
  ).exec();
  if (!currDisorder) return new Error('Error finding or creating disorder');

  // retrieve all existing subdisorders in the database
  const currSubIds = JSON.parse(JSON.stringify(currDisorder.subdisorders));
  // eslint-disable-next-line prefer-const
  let currSubdisorderNames: string[] = [];
  if (currSubIds.length > 0) {
    currSubIds.forEach(async (id: any) => {
      const subdisorder = await Disorder.findOne({
        _id: new mongoose.Types.ObjectId(id._id),
      }).exec();
      if (subdisorder) {
        currSubdisorderNames.push(subdisorder.name);
      }
    });
  }

  // creates new subdisorders, assumes that all subdisorders have one unique parent
  // frontend doesn't like .filter for some reason
  // const newSubdisorderNames = subdisorderNames.filter(
  //   (x) => !currSubdisorderNames.includes(x),
  // );
  const newSubdisorderNames = [];
  for (let i = 0; i < subdisorderNames.length; i += 1) {
    const x = subdisorderNames[i];
    if (!currSubdisorderNames.includes(x)) {
      newSubdisorderNames.push(x);
    }
  }
  for (const disorderName of newSubdisorderNames) {
    await Disorder.findOneAndUpdate(
      { name: disorderName },
      { name: disorderName, parent: currDisorder },
      { new: true, upsert: true },
    ).exec();
  }

  const allSubdisorders = await Disorder.find({
    name: {
      $in: [...currSubdisorderNames, ...newSubdisorderNames],
    },
  }).exec();
  const parentDisorder = await Disorder.findOne({
    name: parentName,
  }).exec();
  const updatedDisorder = await Disorder.findOneAndUpdate(
    { name },
    { subdisorders: allSubdisorders, parent: parentDisorder },
    { new: true, upsert: true },
  ).exec();
  return updatedDisorder;
}

// assumes distinct disorder names
async function categorizeDisorders(
  disorder1: string[],
  disorder2: string[],
  disorder3: string[],
  disorder4: string[],
) {
  // update disorder hierarchy
  for (const disorder of disorder1) {
    await updateDisorder(disorder, disorder2, '');
  }
  disorder2.forEach(async (disorder: string) => {
    await updateDisorder(disorder, disorder3, disorder1[0]);
  });
  disorder3.forEach(async (disorder: string) => {
    await updateDisorder(disorder, disorder4, disorder2[0]);
  });
  disorder4.forEach(async (disorder: string) => {
    await updateDisorder(disorder, [], disorder3[0]);
  });
}

/**
 * Creates the exposure item from the DB with the specified id
 * @param exposureItem The new exposure item
 * @returns the new item
 */
const createExposureItemInDB = async (
  name: string,
  disorder1: string[],
  disorder2: string[],
  disorder3: string[],
  disorder4: string[],
  formats: string[],
  interventionTypes: string[],
  isAdultAppropriate: boolean,
  isChildAppropriate: boolean,
  keywords: string[],
  modifications: string,
  link: string,
  isAdminUpload: boolean,
) => {
  // update the disorder hierarchy
  await categorizeDisorders(disorder1, disorder2, disorder3, disorder4);

  // retrieve disorders for this exposure item
  let newDisorders = await Disorder.find({
    name: { $in: disorder4 },
  }).exec();
  if (disorder2.length === 0) {
    newDisorders = await Disorder.find({
      name: { $in: disorder1 },
    }).exec();
  } else if (disorder3.length === 0) {
    newDisorders = await Disorder.find({
      name: { $in: disorder2 },
    }).exec();
  } else if (disorder4.length === 0) {
    newDisorders = await Disorder.find({
      name: { $in: disorder3 },
    }).exec();
  }

  // if exposure item with the same name exists, then update associated disorders
  let existingItem = await ExposureItem.findOne({ name }).exec();
  if (existingItem) {
    // retrieve already associated disorders
    const existingDisorders = await Disorder.find({
      _id: {
        $in: existingItem.disorders,
      },
    }).exec();
    // only add disorders that are not already associated
    const addDisorders = newDisorders.filter(
      (d) => !existingDisorders.includes(d),
    );
    existingItem = await ExposureItem.findOneAndUpdate(
      { name },
      { disorders: [...existingDisorders, ...addDisorders] },
    ).exec();
    return existingItem;
  }

  // create new formats, intervention types, and keywords
  formats.forEach(async (format) => {
    await Format.updateOne(
      { name: format },
      { name: format },
      { upsert: true },
    ).exec();
  });
  interventionTypes.forEach(async (intType) => {
    await InterventionType.updateOne(
      { name: intType },
      { name: intType },
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

  // retrieve associated formats, intervention types, and keywords
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
    isApproved: isAdminUpload,
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
  getExposureItemFromDB,
  getAllDisorderItemsFromDB,
  getAllFormatItemsFromDB,
  getAllInterventionTypeItemsFromDB,
  getAllKeywordItemsFromDB,
  getFilteredExposureItemsFromDB,
  deleteExposureItemFromDB,
  createExposureItemInDB,
};
