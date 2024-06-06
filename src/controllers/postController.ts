import { Request, Response } from 'express';
import Post from '../models/Post';

export const createPost = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const { userId } = req;

  try {
    const post = new Post({ title, content, author: userId });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: 'Error creating post' });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) return res.status(404).json({ error: 'Post not found' });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const { userId } = req;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author.toString() !== userId) return res.status(403).json({ error: 'Unauthorized' });

    post.title = title || post.title;
    post.content = content || post.content;
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const { userId } = req;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author.toString() !== userId) return res.status(403).json({ error: 'Unauthorized' });

    await post.remove();
    res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const likePost = async (req: Request, res: Response) => {
  const { userId } = req;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
