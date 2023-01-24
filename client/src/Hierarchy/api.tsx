/**
 * A file containing the api call to submit an exposure item.
 */
import { postData, patchData } from '../util/api';

/**
 * Update the exposure item with the given id.
 * @returns true if successful, false otherwise
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

// eslint-disable-next-line import/prefer-default-export
export { addHierarchy };
