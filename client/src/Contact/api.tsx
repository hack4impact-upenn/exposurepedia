import { postData } from '../util/api';

/**
 * Makes a request to the server to contact us through email
 * @returns true if successful, false otherwise
 */
async function contact(name: string, email: string, message: string) {
  const res = await postData('contact', {
    name,
    email,
    message,
  });
  if (res.error) return false;
  return true;
}

// eslint-disable-next-line import/prefer-default-export
export { contact };
