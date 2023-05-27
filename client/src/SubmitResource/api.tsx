/**
 * A file containing the api call to submit an exposure item.
 */
import { postData } from '../util/api';

/**
 * Makes a request to the server to submit an exposure item.
 * @param name The name of the exposure item.
 * @param disorders The disorders that the exposure item is appropriate for.
 * @param formats The formats that the exposure item contains.
 * @param interventionTypes The intervention types that the exposure item uses.
 * @param isAdultAppropriate Whether the exposure item is appropriate for adults.
 * @param isChildAppropriate Whether the exposure item is appropriate for children.
 * @param keywords The keywords that describe the exposure item.
 * @param modifications The modifications that should be made to the exposure item.
 * @param link The link to the exposure item.
 * @returns true if successful, false otherwise
 */
async function submit(
  name: string,
  disorder1: string[],
  disorder2: string[],
  disorder3: string[],
  disorder4: string[],
  formats: string[],
  interventionTypes: string[],
  isAdultAppropriate: boolean,
  isChildAppropriate: boolean,
  keywords: string[],
  modifications: string,
  link: string,
) {
  const res = await postData('exposure', {
    name,
    disorder1,
    disorder2,
    disorder3,
    disorder4,
    formats,
    interventionTypes,
    isAdultAppropriate,
    isChildAppropriate,
    keywords,
    modifications,
    link,
  });
  if (res.error) {
    return false;
  }
  return true;
}

export default submit;
