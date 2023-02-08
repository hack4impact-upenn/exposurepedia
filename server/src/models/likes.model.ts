/**
 * Defines the Likes model for the database and also the interface to
 * access the model in TypeScript.
 */
import mongoose, { Schema } from 'mongoose';

const LikesSchema = new mongoose.Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  exposure_id: { type: Schema.Types.ObjectId, ref: 'ExposureItem' },
});

interface ILikes extends mongoose.Document {
  _id: string;
  user_id: string;
  exposure_id: string;
}

const Likes = mongoose.model<ILikes>('Likes', LikesSchema);

export { ILikes, Likes };
