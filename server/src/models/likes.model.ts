/**
 * Defines the Likes model for the database and also the interface to
 * access the model in TypeScript.
 */
import mongoose, { Schema } from 'mongoose';

const LikesSchema = new mongoose.Schema({
  user: {
    type: { type: Schema.Types.ObjectId, ref: 'User' },
    required: true,
  },
  exposureItem: {
    type: { type: Schema.Types.ObjectId, ref: 'ExposureItem' },
    required: true,
  },
});

interface ILikes extends mongoose.Document {
  _id: string;
  user: string;
  exposureItem: string;
}

const Likes = mongoose.model<ILikes>('Likes', LikesSchema);

export { ILikes, Likes };
