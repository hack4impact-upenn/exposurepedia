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
});

interface IKeyword extends mongoose.Document {
  _id: string;
  name: string;
}

const Keyword = mongoose.model<IKeyword>('Keyword', KeywordSchema);

export { IKeyword, Keyword };
