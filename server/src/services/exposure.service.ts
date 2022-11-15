/**
 * All the functions for interacting with exposure data in the MongoDB database
 */
import { ExposureItem } from '../models/exposureItem.model';

const getByID = async (id: string) => {
  const item = await ExposureItem.findById(id).exec();
  return item;
};

const deleteByID = async (id: string) => {
  const item = await ExposureItem.findByIdAndDelete(id).exec();
  return item;
};

export { getByID, deleteByID };
