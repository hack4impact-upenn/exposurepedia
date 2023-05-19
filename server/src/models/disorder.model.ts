/**
 * Defines the Disorder model for the database and also the interface to
 * access the model in TypeScript.
 */
import mongoose, { Schema } from 'mongoose';

const DisorderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subdisorders: {
    type: { type: Schema.Types.ObjectId, ref: 'Disorder' },
    required: false,
  },
  parent: {
    type: { type: Schema.Types.ObjectId, ref: 'Disorder' },
    required: false,
  },
});

interface IDisorder extends mongoose.Document {
  _id: string;
  name: string;
  subdisorders?: IDisorder[];
  parent?: IDisorder;
}

const Disorder = mongoose.model<IDisorder>('Disorder', DisorderSchema);

export { IDisorder, Disorder };
