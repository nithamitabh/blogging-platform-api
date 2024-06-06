import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { createComment, deleteComment } from '../controllers/commentController';

const router = Router();

router.post('/posts/:postId/comments', authenticate, createComment);
router.delete('/comments/:commentId', authenticate, deleteComment);

export default router;
