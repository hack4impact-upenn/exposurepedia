/**
 * All the functions for interacting with exposure data in the MongoDB database
 */
import { ExposureItem, IExposureItem } from '../models/exposureItem.model';

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
};