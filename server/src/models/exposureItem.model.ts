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
    required: false,
  },
  link: {
    type: String,
    required: false,
  },
  numLikes: {
    type: Number,
    required: true,
  },
  isLinkBroken: {
    type: Boolean,
    required: true,
  },
  isApproved: {
    type: Boolean,
    required: true,
  },
  dateUpdated: {
    type: Date,
    required: true,
  },
});

interface IExposureItem extends mongoose.Document {
  _id: string;
  name: string;
  disorders: string[];
  formats: string[];
  interventionTypes: string[];
  maturities: string[];
  keywords: string[];
  modifications: string;
  link: string;
  numLikes: number;
  isLinkBroken: boolean;
  isApproved: boolean;
  dateUpdated: Date;
}

const ExposureItem = mongoose.model<IExposureItem>(
  'ExposureItem',
  ExposureItemSchema,
);

export { IExposureItem, ExposureItem };
