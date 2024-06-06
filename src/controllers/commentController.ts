import { Request, Response } from 'express';
import Comment from '../models/Comment';
import Post from '../models/Post';

export const createComment = async (req: Request, res: Response) => {
  const { content } = req.body;
  const { userId } = req;
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = new Comment({ content, author: userId, post: postId });
    await comment.save();

    post.comments.push(comment._id);
    await post.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: 'Error creating comment' });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const { userId } = req;
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.author.toString() !== userId) return res.status(403).json({ error: 'Unauthorized' });

    await comment.remove();
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
