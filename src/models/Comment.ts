import mongoose, { Document, Schema } from 'mongoose';

interface IComment extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>({
  content: { type: String, required: true },
  author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  post: { type: mongoose.Types.ObjectId, ref: 'Post', required: true },
}, { timestamps: true });

const Comment = mongoose.model<IComment>('Comment', commentSchema);
export default Comment;
