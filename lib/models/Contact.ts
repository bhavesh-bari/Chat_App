import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage {
  id: string;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  text: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

export interface IContact extends Document {
  user: Types.ObjectId; // Owner of this contact
  contactUser: Types.ObjectId; // The actual contact (referencing User model)
  status: 'online' | 'offline';
  lastMessage?: string;
  time?: string;
  unread: number;
  messages: IMessage[];
}

const MessageSchema = new Schema<IMessage>({
  id: { type: String, required: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, required: true },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent',
  },
});

const ContactSchema = new Schema<IContact>(
 {//const currentUser = await User.findById(decoded.id).populate({
//   path: 'contacts',
//   populate: {
//     path: 'user',
//     select: 'name email avatarUrl',
//   },
// });

    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contactUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['online', 'offline'],
      default: 'offline',
    },
    lastMessage: {
      type: String,
    },
    time: {
      type: String,
    },
    unread: {
      type: Number,
      default: 0,
    },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

export const Contact = mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);
