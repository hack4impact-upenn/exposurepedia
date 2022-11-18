/**
 * All the functions for interacting with exposure items in the MongoDB database
 */
import { ExposureItem } from '../models/exposureItem.model';

export interface ExposureItemFilters {
  disorders?: string[];
  formats?: string[];
  interventionTypes?: string[];
  keywords?: string[];
}

export const getAllExposureItemsFromDB = async (
  query: string, // title (search query)
  filters: ExposureItemFilters,
) => {
  const exposureItemList = await ExposureItem.find(
    {
      // match anything if no string
      ...(query && { name: { $regex: query } }),

      // if there are disorders available, then match any level to them
      ...(filters.disorders && {
        $or: [
          {
            disorders_level1: {
              $in: filters.disorders,
            },
          },
          {
            disorders_level2: {
              $in: filters.disorders,
            },
          },
          {
            disorders_level3: {
              $in: filters.disorders,
            },
          },
          {
            disorders_level4: {
              $in: filters.disorders,
            },
          },
        ],
      }),
      ...(filters.formats && {
        formats: {
          $elemMatch: {
            name: { $in: filters.formats },
          },
        },
      }),
      ...(filters.interventionTypes && {
        interventionTypes: {
          $elemMatch: {
            name: { $in: filters.interventionTypes },
          },
        },
      }),
      ...(filters.keywords && {
        keywords: {
          $elemMatch: {
            name: { $in: filters.keywords },
          },
        },
      }),
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
