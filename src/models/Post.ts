import mongoose, { Document, Schema } from 'mongoose';
import markdownIt from 'markdown-it';

interface IPost extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  renderMarkdown(): string;
}

const postSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

postSchema.methods.renderMarkdown = function() {
  const md = new markdownIt();
  return md.render(this.content);
};

const Post = mongoose.model<IPost>('Post', postSchema);
export default Post;
