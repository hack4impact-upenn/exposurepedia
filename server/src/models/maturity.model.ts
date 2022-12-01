/**
 * Defines the Maturity model for the database and also the interface to
 * access the model in TypeScript.
 */
import mongoose from 'mongoose';

const MaturitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

interface IMaturity extends mongoose.Document {
  _id: string;
  name: string;
}

const Maturity = mongoose.model<IMaturity>('Disorder', MaturitySchema);

export { IMaturity, Maturity };
