/**
 * All the functions for interacting with exposure data in the MongoDB database
 */
import { Disorder } from '../models/disorder.model';
import { ExposureItem } from '../models/exposureItem.model';
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
  getExposureItemFromDB,
  deleteExposureItemFromDB,
  createExposureItemInDB,
};
