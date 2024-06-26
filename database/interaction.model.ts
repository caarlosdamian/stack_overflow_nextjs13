import { Schema, model, models, Document } from 'mongoose';

export interface IInteraction extends Document {
  user: Schema.Types.ObjectId; // reference to user
  action: string;
  question: Schema.Types.ObjectId; // referece to question
  answer: Schema.Types.ObjectId; // reference to answers
  tags: Schema.Types.ObjectId[]; // reference to answers
  createdAt: Date;
}

const InteractionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', require: true },
  action: { type: String, require: true },
  question: { type: Schema.Types.ObjectId, ref: 'Question', require: true },
  answer: { type: Schema.Types.ObjectId, ref: 'Answer', require: true },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag', require: true }],
  createdAt: { type: Date, default: Date.now },
});

const Interaction =
  models.Interaction || model('Interaction', InteractionSchema);

export default Interaction;
