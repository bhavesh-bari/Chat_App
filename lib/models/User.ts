import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  avatarUrl: string;
  contacts: Types.ObjectId[]; // Referencing Contact documents
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    contacts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Contact', // Refers to the Contact model (which now links to contactUser)
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
