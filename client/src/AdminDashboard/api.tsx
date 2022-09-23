import { deleteData, putData } from '../util/api';

/**
 * Sends a request to the server to delete a user
 * @param email - the email of the user to delete
 * @returns true if successful, false otherwise
 */
async function deleteUser(email: string) {
  const res = await deleteData(`user/${email}`);
  if (res.error) return false;
  return true;
}
/**
 * Sends a request to the server to promote a user to admin
 * @param email - the email of the user to promote
 * @returns true if successful, false otherwise
 */
async function upgradePrivilege(email: string) {
  const res = await putData('user/promote', { email });
  if (res.error) return false;
  return true;
}

export { deleteUser, upgradePrivilege };
