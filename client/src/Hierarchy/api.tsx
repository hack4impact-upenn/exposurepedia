/**
 * A file containing the api call to submit an exposure item.
 */
import { getData, postData, patchData, deleteData } from '../util/api';

/**
 * Retrieves a hierarchy from the database
 * @param email the email of the user
 * @param hierarchy_id the id of the hierarchy
 */
async function getHierarchy(email: string, hierarchyId: string) {
  const res = await getData(`hierarchy/${email}/${hierarchyId}`);
  return res?.data;
}

/**
 * Adds a hierarchy to the database.
 * @param email the email of the user
 * @param title the title of the hierarchy
 * @param description the description of the hierarchy
 */
async function addHierarchy(email: string, title: string, description: string) {
  const res = await postData('hierarchy/', {
    email,
    title,
    description,
  });
  return res;
}

/**
 * Updates a hierarchy in the database.
 * @returns true if successful, false otherwise
 * @param email the email of the user
 * @param id the id of the hierarchy
 * @param title the title of the hierarchy
 * @param description the description of the hierarchy
 * @param exposure_triplets the name, no, and suds of each exposure item in the hierarchy
 */
async function updateHierarchy(
  email: string,
  id: string,
  title?: string,
  description?: string,
  exposureTriplets?: [string, string, string][],
) {
  const res = await patchData(`hierarchy/${email}/${id}`, {
    title,
    description,
    exposureTriplets,
  });
  if (res.error) return false;
  return true;
}

/**
 * Deletes a hierarchy in the database.
 * @returns true if successful, false otherwise
 * @param email the email of the user
 * @param id the id of the hierarchy
 */
async function deleteHierarchy(email: string, id: string) {
  const res = await deleteData(`hierarchy/${email}/${id}`);
  if (res.error) return false;
  return true;
}

// eslint-disable-next-line import/prefer-default-export
export { getHierarchy, addHierarchy, updateHierarchy, deleteHierarchy };
