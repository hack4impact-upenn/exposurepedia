import { Hierarchy } from '../models/hierarchy.model';

const getHierarchiesByUser = async (userId: string) => {
  const hierarchies = await Hierarchy.find({ user: userId }).exec();
  return hierarchies.map((hierarchy) => ({
    id: hierarchy._id,
    title: hierarchy.title,
    description: hierarchy.description,
    exposures: hierarchy.exposures,
    updated_at: hierarchy.dateUpdated,
  }));
};

const getHierarchyById = async (hierarchyId: string, userId: string) => {
  const hierarchy = await Hierarchy.findOne({
    _id: hierarchyId,
    user: userId,
  }).exec();
  if (!hierarchy) {
    throw new Error('Unable to find hierarchy');
  }

  return {
    id: hierarchy._id,
    title: hierarchy.title,
    user_id: hierarchy.user,
    description: hierarchy.description,
    exposures: hierarchy.exposures,
    updated_at: hierarchy.dateUpdated,
  };
};

const createHierarchy = async (
  userId: string,
  title: string,
  description: string,
) => {
  const hierarchy = new Hierarchy({
    user: userId,
    title,
    description,
    dateUpdated: new Date(),
  });
  await hierarchy.save();
  return hierarchy._id;
};

const updateHierarchy = async (
  userId: string,
  hierarchyId: string,
  title: string,
  description: string,
  exposures: [string, string, string][],
) => {
  const hierarchy = await Hierarchy.findOne({
    _id: hierarchyId,
    user: userId,
  }).exec();
  if (!hierarchy) {
    throw new Error('Unable to find hierarchy');
  }

  if (title !== undefined) {
    hierarchy.title = title;
  }
  if (description !== undefined) {
    hierarchy.description = description;
  }

  await Hierarchy.updateOne(
    { _id: hierarchyId },
    { $set: { exposures, title, description } },
  ).exec();
  // await hierarchy.save();
};

const deleteHierarchy = async (userId: string, hierarchyId: string) => {
  const hierarchy = await Hierarchy.findOne({
    _id: hierarchyId,
    user: userId,
  }).exec();
  if (!hierarchy) {
    throw new Error('Unable to find hierarchy');
  }
  await hierarchy.remove();
};

export {
  getHierarchiesByUser,
  createHierarchy,
  updateHierarchy,
  getHierarchyById,
  deleteHierarchy,
};
