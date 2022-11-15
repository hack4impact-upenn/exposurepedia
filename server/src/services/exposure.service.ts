/**
 * All the functions for interacting with exposure data in the MongoDB database
 */
import { ExposureItem } from '../models/exposureItem.model';

interface Filter {
  disorders?: string[];
  format?: string[];
  intervention_types?: string[];
  keywords?: string[];
}

const getItems = async (query?: string, filters?: Filter) => {
  const items = await ExposureItem.find({
    name: { $search: query },
    filters,
  }).exec();
  return items;
};

const getItemByID = async (id: number) => {
  const item = await ExposureItem.findById(id).exec();
  return item;
};

export { getItems, getItemByID };
