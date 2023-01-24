import { Hierarchy } from '../models/hierarchy.model';

const getHierarchiesByUser = async (userId: string) => {
  const hierarchies = await Hierarchy.find({ user: userId }).exec();
  return hierarchies.map((hierarchy) => ({
    id: hierarchy._id,
    title: hierarchy.title,
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
    exposure_ids: hierarchy.exposureItems,
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
};

const updateHierarchy = async (
  userId: string,
  hierarchyId: string,
  title: string,
  description: string,
  exposureIds: [string, string, string][],
) => {
  console.log('hierarchyId: ', hierarchyId);
  console.log('userId: ', userId);
  console.log('title: ', title);
  console.log('description: ', description);
  console.log('exposureIds: ', exposureIds);
  const hierarchy = await Hierarchy.findOne({
    _id: hierarchyId,
    user: userId,
  }).exec();
  if (!hierarchy) {
    throw new Error('Unable to find hierarchy');
  }
  hierarchy.title = title;
  hierarchy.description = description;
  // hierarchy.set('exposureItems', exposureIds);
  console.log('hierarchy (before update): ', hierarchy);
  await Hierarchy.updateOne(
    { _id: hierarchyId },
    { $set: { exposureItems: ['tjuj'] } },
  ).exec();
  console.log('hierarchy (updated): ', hierarchy);
  await hierarchy.save();
};

const deleteHierarchy = async (hierarchyId: string) => {
  const hierarchy = await Hierarchy.findOne({ _id: hierarchyId }).exec();
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
