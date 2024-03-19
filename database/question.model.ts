import mongoose, { Schema, Document, models } from 'mongoose';

interface IQuestion extends Document {
  title: string;
  content: string;
  explanation: string;
  views: number;
  tags: Schema.Types.ObjectId;
  author: Schema.Types.ObjectId;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  answers: Schema.Types.ObjectId[];
  createdAt: Date;
}

const questionSchema = new Schema<IQuestion>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
    upvotes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    author: { type: mongoose.Types.ObjectId, ref: 'User' },
    views: { type: Number, require: true, default: 0 },
    answers: [{ type: mongoose.Types.ObjectId, ref: 'Answer' }],
  },
  { timestamps: true }
);

const Question = models.Question || mongoose.model('Question', questionSchema);

export default Question;
