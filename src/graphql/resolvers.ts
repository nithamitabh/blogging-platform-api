import User from '../models/User';
import Post from '../models/Post';
import Comment from '../models/Comment';
import jwt from 'jsonwebtoken';

const authenticate = (token: string) => {
  if (!token) throw new Error('Authentication token missing');
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET!);
    return decoded.id;
  } catch {
    throw new Error('Invalid token');
  }
};

const resolvers = {
  Query: {
    getPosts: async () => {
      return await Post.find().populate('author').sort({ createdAt: -1 });
    },
    getPostById: async (_: any, { id }: { id: string }) => {
      return await Post.findById(id).populate('author');
    },
    getCommentsByPost: async (_: any, { postId }: { postId: string }) => {
      return await Comment.find({ post: postId }).populate('author');
    },
  },
  Mutation: {
    register: async (_: any, { username, email, password }: { username: string; email: string; password: string }) => {
      const user = new User({ username, email, password });
      await user.save();
      const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET!, { expiresIn: '1h' });
      return token;
    },
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        throw new Error('Invalid email or password');
      }
      const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET!, { expiresIn: '1h' });
      return token;
    },
    createPost: async (_: any, { title, content }: { title: string; content: string }, { token }: { token: string }) => {
      const userId = authenticate(token);
      const post = new Post({ title, content, author: userId });
      await post.save();
      return post.populate('author');
    },
    updatePost: async (_: any, { id, title, content }: { id: string; title?: string; content?: string }, { token }: { token: string }) => {
      const userId = authenticate(token);
      const post = await Post.findById(id);
      if (!post) throw new Error('Post not found');
      if (post.author.toString() !== userId) throw new Error('Unauthorized');
      if (title) post.title = title;
      if (content) post.content = content;
      await post.save();
      return post.populate('author');
    },
    deletePost: async (_: any, { id }: { id: string }, { token }: { token: string }) => {
      const userId = authenticate(token);
      const post = await Post.findById(id);
      if (!post) throw new Error('Post not found');
      if (post.author.toString() !== userId) throw new Error('Unauthorized');
      await post.remove();
      return true;
    },
    likePost: async (_: any, { id }: { id: string }, { token }: { token: string }) => {
      const userId = authenticate(token);
      const post = await Post.findById(id);
      if (!post) throw new Error('Post not found');
      if (post.likes.includes(userId)) {
        post.likes.pull(userId);
      } else {
        post.likes.push(userId);
      }
      await post.save();
      return post.populate('author');
    },
    createComment: async (_: any, { postId, content }: { postId: string; content: string }, { token }: { token: string }) => {
      const userId = authenticate(token);
      const comment = new Comment({ content, author: userId, post: postId });
      await comment.save();
      return comment.populate('author');
    },
    deleteComment: async (_: any, { id }: { id: string }, { token }: { token: string }) => {
      const userId = authenticate(token);
      const comment = await Comment.findById(id);
      if (!comment) throw new Error('Comment not found');
      if (comment.author.toString() !== userId) throw new Error('Unauthorized');
      await comment.remove();
      return true;
    },
  },
};

export default resolvers;
