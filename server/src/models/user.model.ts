/**
 * Defines the User model for the database and also the interface to
 * access the model in TypeScript.
 */
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    match:
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g,
  },
  date: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  verificationToken: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  resetPasswordToken: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  resetPasswordTokenExpiryDate: {
    type: Date,
    required: false,
  },
  admin: {
    type: Boolean,
    required: true,
    default: false,
  },
  status: {
    type: String,
    required: false,
  },
  isProfessional: {
    type: Boolean,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: false,
    default: '',
  },
  settings: {
    type: [String],
    required: true,
  },
  percentCaseload: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: Number,
    required: true,
  },
});

interface IUser extends mongoose.Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  date: string;
  password: string;
  verified: boolean;
  verificationToken: string | null | undefined;
  resetPasswordToken: string | null | undefined;
  resetPasswordTokenExpiryDate: Date | null | undefined;
  admin: boolean;
  status: string;
  isProfessional: boolean;
  profession: string;
  settings: [string];
  percentCaseload: number;
  difficulty: number;
}

const User = mongoose.model<IUser>('User', UserSchema);

export { IUser, User };
