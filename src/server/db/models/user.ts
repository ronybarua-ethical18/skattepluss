import mongoose, { Schema } from 'mongoose';
import { IUser } from '../interfaces/user';

const UserSchema: Schema = new Schema<IUser>(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return this.provider === 'credentials';
      },
    },
    provider: {
      type: String,
      enum: ['credentials', 'google'],
      default: 'credentials',
    },
    role: {
      type: String,
      enum: ['admin', 'auditor', 'customer'],
      default: 'customer',
    },
    image: {
      type: String,
    },

    questionnaires: [
      {
        question: { type: String, required: true },
        answers: [],
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

const User = mongoose.models.user || mongoose.model<IUser>('user', UserSchema);

export default User;
