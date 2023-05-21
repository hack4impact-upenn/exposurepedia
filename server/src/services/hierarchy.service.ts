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
  const existingHierarchy = await Hierarchy.find({
    title,
    user: userId,
  }).exec();
  if (existingHierarchy && existingHierarchy.length !== 0) {
    throw new Error('Hierarchy name already exists');
  }
  const defaultExposures: [string, string, string][] = [
    ['exposure item 1', '1', '50'],
    ['exposure item 2', '2', '50'],
    ['exposure item 3', '3', '50'],
  ];
  const hierarchy = new Hierarchy({
    user: userId,
    title,
    description,
    exposures: defaultExposures,
    dateUpdated: new Date(),
  });
  await hierarchy.save();
  return hierarchy;
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
