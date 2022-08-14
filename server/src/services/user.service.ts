import { hash } from 'bcrypt';
import { User, AuthenticationType } from '../models/user';

const createUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) => {
  const saltRounds = 10;
  const hashedPassword = await hash(password, saltRounds);
  if (!hashedPassword) {
    console.log('Error hashing password');
    return null;
  }
  const newUser = new User({
    accountType: AuthenticationType.Internal,
    firstName,
    lastName,
    email,
    password: hashedPassword,
    admin: false,
  });
  const user = await newUser.save();
  return user;
};

const getUserByEmail = async (email: string) => {
  const user = await User.findOne({ email })
    .select(['-password', '-accountType'])
    .exec();
  return user;
};

const getUserById = async (id: string) => {
  const user = await User.findById(id)
    .select(['-password', '-accountType'])
    .exec();
  return user;
};

const getUserByEmailWithPassword = async (email: string) => {
  const user = await User.findOne({ email }).select(['-accountType']).exec();
  return user;
};

const getAllUsersFromDB = async () => {
  const userList = await User.find({})
    .select(['-password', '-accountType'])
    .exec();
  return userList;
};

/**
 * A function that upgrades a certain user to an admin.
 * @param id
 * @returns updated user
 */
const toggleAdmin = async (id: string) => {
  const user = await User.findByIdAndUpdate(id, [
    { $set: { admin: { $eq: [false, '$admin'] } } },
  ]).exec();
  return user;
};

const deleteUserById = async (id: string) => {
  const user = await User.findByIdAndDelete(id).exec();
  return user;
};

export {
  createUser,
  getUserByEmail,
  getUserById,
  getUserByEmailWithPassword,
  getAllUsersFromDB,
  toggleAdmin,
  deleteUserById,
};
