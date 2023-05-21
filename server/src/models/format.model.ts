/**
 * Defines the Format model for the database and also the interface to
 * access the model in TypeScript.
 */
import mongoose from 'mongoose';

const FormatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    required: true,
  },
});

interface IFormat extends mongoose.Document {
  _id: string;
  name: string;
  approved: boolean;
}

const Format = mongoose.model<IFormat>('Format', FormatSchema);

export { IFormat, Format };
