/**
 * Defines the Disorder model for the database and also the interface to
 * access the model in TypeScript.
 */
import mongoose from 'mongoose';

const KeywordSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    required: true,
  },
});

interface IKeyword extends mongoose.Document {
  _id: string;
  name: string;
  approved: boolean;
}

const Keyword = mongoose.model<IKeyword>('Keyword', KeywordSchema);

export { IKeyword, Keyword };
