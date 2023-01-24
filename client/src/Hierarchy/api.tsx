/**
 * A file containing the api call to submit an exposure item.
 */
import { postData, patchData } from '../util/api';

/**
 * Adds a hierarchy to the database.
 * @returns true if successful, false otherwise
 * @param email the email of the user
 * @param title the title of the hierarchy
 * @param description the description of the hierarchy
 */
async function addHierarchy(email: string, title: string, description: string) {
  console.log(email, title, description);
  const res = await postData('hierarchy/', {
    email,
    title,
    description,
  });
  if (res.error) return false;
  console.log(res);
  return true;
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
  title: string,
  description: string,
  exposureTriplets: [string, string, string][],
) {
  console.log(email, id, title, description, exposureTriplets);
  const res = await patchData(`hierarchy/${email}/${id}`, {
    title,
    description,
    exposureTriplets,
  });
  if (res.error) return false;
  console.log(res);
  return true;
}

// eslint-disable-next-line import/prefer-default-export
export { addHierarchy, updateHierarchy };
