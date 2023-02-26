/* eslint-disable camelcase */
import mongoose from 'mongoose';
import { Likes } from '../models/likes.model';

const getLikesByExposureItem = async (exposure_id: string) => {
  const likeCount = await Likes.countDocuments({
    exposure_id: new mongoose.Types.ObjectId(exposure_id),
  }).exec();
  return likeCount || 0;
};

const removeLike = async (exposure_id: string, user_id: string) => {
  const like = await Likes.findOne({
    exposure_id: new mongoose.Types.ObjectId(exposure_id),
    user_id: new mongoose.Types.ObjectId(user_id),
  }).exec();
  if (!like) {
    throw new Error('Unable to find like');
  }
  await like.remove();
};

export { getLikesByExposureItem, removeLike };
