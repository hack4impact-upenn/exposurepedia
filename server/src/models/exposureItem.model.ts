/**
 * Defines the Exposure Item model for the database and also the interface to
 * access the model in TypeScript.
 */
import mongoose, { Schema } from 'mongoose';

const ExposureItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  disorders: [{ type: Schema.Types.ObjectId, ref: 'Disorder' }],
  formats: [{ type: Schema.Types.ObjectId, ref: 'Format' }],
  interventionTypes: [
    { type: Schema.Types.ObjectId, ref: 'Intervention Type' },
  ],
  maturities: [{ type: Schema.Types.ObjectId, ref: 'Maturity' }],
  keywords: [{ type: Schema.Types.ObjectId, ref: 'Keyword' }],
  modifications: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  userLikes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  dateUpdated: {
    type: Date,
    required: true,
  },
});

interface IExposureItem extends mongoose.Document {
  _id: string;
  name: string;
  disorder: string[];
  formats: string[];
  interventionTypes: string[];
  maturities: string[];
  keywords: string[];
  modifications: string;
  link: string;
  userLikes: string[];
  dateUpdated: Date;
}

const ExposureItem = mongoose.model<IExposureItem>(
  'ExposureItem',
  ExposureItemSchema,
);

export { IExposureItem, ExposureItem };
