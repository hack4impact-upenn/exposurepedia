/**
 * All the functions for interacting with exposure data in the MongoDB database
 */
import { Disorder } from '../models/disorder.model';
import { ExposureItem, IExposureItem } from '../models/exposureItem.model';
import { Format } from '../models/format.model';
import { InterventionType } from '../models/interventionType.model';
import { Keyword } from '../models/keyword.model';

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
 * Update exposure item in DB given id and new exposure item
 * @param id The id of the exposure item to update
 * @param updatedItem The new exposure item
 * @returns The old exposure item
 */
const updateExposureItemInDB = async (
  id: string,
  updatedItem: IExposureItem,
) => {
  const item = await ExposureItem.findOneAndReplace(
    { _id: id },
    updatedItem,
  ).exec();
  return item;
};

/**
 * Creates the exposure item from the DB with the specified id
 * @param exposureItem The new exposure item
 * @returns the new item
 */
const createExposureItemInDB = async (exposureItem: IExposureItem) => {
  // updateOne does not return documents, so must update/create and then find
  exposureItem.keywords.forEach(async (keyword) => {
    await Keyword.updateOne(
      { name: keyword },
      { name: keyword },
      { upsert: true },
    ).exec();
  });

  const newDisorders = await Disorder.find({
    name: { $in: exposureItem.disorders },
  }).exec();
  const newFormats = await Format.find({
    name: { $in: exposureItem.formats },
  }).exec();
  const newInterventionTypes = await InterventionType.find({
    name: { $in: exposureItem.interventionTypes },
  }).exec();
  const newKeywords = await Keyword.find({
    name: { $in: exposureItem.keywords },
  }).exec();

  const newExposureItem = new ExposureItem({
    name: exposureItem.name,
    disorders: newDisorders,
    formats: newFormats,
    interventionTypes: newInterventionTypes,
    isAdultAppropriate: exposureItem.isAdultAppropriate,
    isChildAppropriate: exposureItem.isChildAppropriate,
    keywords: newKeywords,
    modifications: exposureItem.modifications,
    link: exposureItem.link,
    numLikes: 0,
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
  getExposureItemFromDB,
  updateExposureItemInDB,
  deleteExposureItemFromDB,
  createExposureItemInDB,
};
