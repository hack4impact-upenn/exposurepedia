/**
 * All the functions for interacting with exposure items in the MongoDB database
 */
import { ExposureItem } from '../models/exposureItem.model';

interface ExposureItemFilters {
  disorders?: string[];
  formats?: string[];
  interventionTypes?: string[];
  keywords?: string[];
}

const getAllExposureItemsFromDB = async (
  query: string, // title
  filters: ExposureItemFilters,
) => {
  // query, projection, options
  const exposureItemList = await ExposureItem.find(
    {
      name: query ? { $regex: query } : {}, // match anything if no string
      disorders_level1: {
        $in: filters.disorders,
      },
      disorders_level2: {
        $in: filters.disorders,
      },
      disorders_level3: {
        $in: filters.disorders,
      },
      disorders_level4: {
        $in: filters.disorders,
      },
      formats: {
        $elemMatch: {
          name: { $in: filters.formats },
        },
      },
      interventionTypes: {
        $elemMatch: {
          name: { $in: filters.interventionTypes },
        },
      },
      keywords: {
        $elemMatch: {
          name: { $in: filters.keywords },
        },
      },
    },
    {
      id: 1,
      title: 1,
      format: 1,
      num_likes: 1,
      updated_at: 1,
    },
  );
  return exposureItemList;
};

export default getAllExposureItemsFromDB;
