/* eslint-disable @typescript-eslint/no-explicit-any */
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
  isApproved: boolean,
) {
  // create the current disorder
  const existingDisorder = await Disorder.findOne({
    name,
  }).exec();
  const currDisorder = await Disorder.findOneAndUpdate(
    { name },
    {
      name,
      approved: existingDisorder
        ? existingDisorder.approved || isApproved
        : isApproved,
    },
    { new: true, upsert: true },
  ).exec();
  if (!currDisorder) return new Error('Error finding or creating disorder');

  // retrieve all existing subdisorders in the database
  const currSubdisorders = await Disorder.aggregate([
    {
      $lookup: {
        from: 'disorders',
        localField: 'parent',
        foreignField: '_id',
        as: 'parent',
      },
    },
    {
      $unwind: '$parent',
    },
    {
      $match: { 'parent.name': name },
    },
    {
      $project: { name: 1 },
    },
  ]).exec();
  const currSubdisorderNames = currSubdisorders.map((x) => x.name);

  // creates new subdisorders, assumes that all subdisorders have one unique parent
  const newSubdisorderNames = [];
  if (subdisorderNames.length > 0) {
    // add general category in subdisorders if subdisorders exist
    // eslint-disable-next-line no-param-reassign
    subdisorderNames = [...subdisorderNames, `General ${currDisorder.name}`];
  }
  // frontend doesn't like .filter for some reason, hence this for loop
  for (let i = 0; i < subdisorderNames.length; i += 1) {
    const x = subdisorderNames[i];
    if (!currSubdisorderNames.includes(x)) {
      newSubdisorderNames.push(x);
    }
  }
  for (const disorderName of newSubdisorderNames) {
    const currApproved = isApproved || disorderName.includes('General');
    await Disorder.findOneAndUpdate(
      { name: disorderName },
      {
        name: disorderName,
        parent: currDisorder,
        approved: currApproved,
      },
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
    {
      subdisorders: allSubdisorders,
      parent: parentDisorder,
      // approved is already handled above
    },
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
  isApproved: boolean,
) {
  // update disorder hierarchy
  for (const disorder of disorder1) {
    await updateDisorder(disorder, disorder2, '', isApproved);
  }
  for (const disorder of disorder2) {
    await updateDisorder(disorder, disorder3, disorder1[0], isApproved);
  }
  for (const disorder of disorder3) {
    await updateDisorder(disorder, disorder4, disorder2[0], isApproved);
  }
  for (const disorder of disorder4) {
    await updateDisorder(disorder, [], disorder3[0], isApproved);
  }
}

// determine whether exposure item needs to have a "General ..." disorder tag
function addGeneralDisorder(newDisorders: any) {
  const generalDisorders: any = [];
  // eslint-disable-next-line consistent-return
  newDisorders.forEach(async (disorder: any) => {
    if (disorder.subdisorder && disorder.subdisorder.length !== 0) {
      const generalDisorder = await Disorder.findOneAndUpdate(
        { name: `General ${disorder.name}` },
        {
          name: `General ${disorder.name}`,
          approved: true,
        },
        { new: true, upsert: true },
      ).exec();
      generalDisorders.push(generalDisorder);
    }
  });
  return generalDisorders;
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
  await categorizeDisorders(
    disorder1,
    disorder2,
    disorder3,
    disorder4,
    isAdminUpload,
  );

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

  // check if disorder should be tagged with a general subdisorder
  const generalDisorders = await addGeneralDisorder(newDisorders);
  if (generalDisorders.length > 0) {
    newDisorders = [...newDisorders, ...generalDisorders];
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
      {
        disorders: [...existingDisorders, ...addDisorders],
      },
    ).exec();
    return existingItem;
  }

  // create new formats, intervention types, and keywords
  formats.forEach(async (format) => {
    if (format !== '') {
      const currFormat = await Format.findOne({ name: format }).exec();
      await Format.updateOne(
        { name: format },
        {
          name: format,
          approved: currFormat
            ? currFormat.approved || isAdminUpload
            : isAdminUpload,
        },
        { upsert: true },
      ).exec();
    }
  });
  interventionTypes.forEach(async (intType) => {
    if (intType !== '') {
      const currIntType = await InterventionType.findOne({
        name: intType,
      }).exec();
      await InterventionType.updateOne(
        { name: intType },
        {
          name: intType,
          approved: currIntType
            ? currIntType.approved || isAdminUpload
            : isAdminUpload,
        },
        { upsert: true },
      ).exec();
    }
  });
  keywords.forEach(async (keyword) => {
    if (keyword !== '') {
      const currKeyword = await Keyword.findOne({ name: keyword }).exec();
      await Keyword.updateOne(
        { name: keyword },
        {
          name: keyword,
          approved: currKeyword
            ? currKeyword.approved || isAdminUpload
            : isAdminUpload,
        },
        { upsert: true },
      ).exec();
    }
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
