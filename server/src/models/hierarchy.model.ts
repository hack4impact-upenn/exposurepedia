/**
 * Defines the Hierarchy model for the database and also the interface to
 * access the model in TypeScript.
 */
import mongoose, { Schema } from 'mongoose';

const HierarchySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  exposureItems: [{ type: Schema.Types.String, ref: 'ExposureItem' }],
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  dateUpdated: {
    type: Date,
    required: true,
  },
});

interface IHierarchy extends mongoose.Document {
  _id: string;
  title: string;
  description: string;
  exposureItems: [string, string, string][];
  user: string;
  dateUpdated: Date;
}

const Hierarchy = mongoose.model<IHierarchy>('Hierarchy', HierarchySchema);

export { IHierarchy, Hierarchy };
