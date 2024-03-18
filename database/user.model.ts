import mongoose, { Document, Schema, models } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  bio?: string;
  picture: string;
  location?: string;
  portafolioWebsite?: string;
  reputation?: number;
  saved: Schema.Types.ObjectId[];
  createdAt: Date;
  joinedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    portafolioWebsite: { type: String },
    reputation: { type: Number, default: 0 },
    saved: [{ type: mongoose.Types.ObjectId, ref: 'Question' }],
    bio: { type: String },
    picture: { type: String, required: true },
    location: { type: String },
    joinedAt: { type: Date, required: true, default: Date.now() },
  },
  { timestamps: { createdAt: 'created_at' } }
);

const User = models.User || mongoose.model('User', userSchema);

export default User;
