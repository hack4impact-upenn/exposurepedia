/**
 * Defines the Exposure Item model for the database and also the interface to
 * access the model in TypeScript.
 */
import mongoose, { Schema } from 'mongoose';
import { IDisorder } from './disorder.model';
import { IFormat } from './format.model';
import { IInterventionType } from './interventionType.model';
import { IKeyword } from './keyword.model';

const ExposureItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    disorders: [{ type: Schema.Types.ObjectId, ref: 'Disorder' }],
    formats: [{ type: Schema.Types.ObjectId, ref: 'Format' }],
    interventionTypes: [
      { type: Schema.Types.ObjectId, ref: 'Intervention Type' },
    ],
    isAdultAppropriate: {
      type: Boolean,
      required: true,
    },
    isChildAppropriate: {
      type: Boolean,
      required: true,
    },
    keywords: [{ type: Schema.Types.ObjectId, ref: 'Keyword' }],
    modifications: {
      type: String,
      required: false,
    },
    link: {
      type: String,
      required: false,
    },
    isLinkBroken: {
      type: Boolean,
      required: true,
    },
    isApproved: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true },
);

interface IExposureItem extends mongoose.Document {
  _id: string;
  name: string;
  disorders: IDisorder[];
  formats: IFormat[];
  interventionTypes: IInterventionType[];
  isAdultAppropriate: boolean;
  isChildAppropriate: boolean;
  keywords: IKeyword[];
  modifications: string;
  link: string;
  isLinkBroken: boolean;
  isApproved: boolean;
}

const ExposureItem = mongoose.model<IExposureItem>(
  'Exposure Item',
  ExposureItemSchema,
);

export { IExposureItem, ExposureItem };
