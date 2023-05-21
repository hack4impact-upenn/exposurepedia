/**
 * Defines the Intervention Type model for the database and also the interface to
 * access the model in TypeScript.
 */
import mongoose from 'mongoose';

const InterventionTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    required: true,
  },
});

interface IInterventionType extends mongoose.Document {
  _id: string;
  name: string;
  approved: boolean;
}

const InterventionType = mongoose.model<IInterventionType>(
  'Intervention Type',
  InterventionTypeSchema,
);

export { IInterventionType, InterventionType };
