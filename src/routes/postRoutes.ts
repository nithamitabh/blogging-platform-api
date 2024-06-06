import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { createPost, getPosts, getPostById, updatePost, deletePost, likePost } from '../controllers/postController';

const router = Router();

router.post('/posts', authenticate, createPost);
router.get('/posts', getPosts);
router.get('/posts/:id', getPostById);
router.put('/posts/:id', authenticate, updatePost);
router.delete('/posts/:id', authenticate, deletePost);
router.post('/posts/:id/like', authenticate, likePost);

export default router;
