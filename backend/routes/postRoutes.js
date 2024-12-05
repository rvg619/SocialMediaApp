// routes/postRoutes.js
import express from 'express';
import postController from '../controllers/postController.js';
import auth from '../middleware/Auth.js'; // Import the auth middleware

const router = express.Router();

// Route to create a new post - protected
router.post('/', auth, postController.createPost);

// Route to get all posts - open to public
router.get('/', auth, postController.getPosts);

// Route to get a specific post by ID - open to public
router.get('/:id', auth, postController.getPostsByUserId);

// Route to update a post by ID - protected
router.put('/:id', auth, postController.updatePost);

router.put('/:pid/:uid/like', auth, postController.toggleLikePost);

router.post('/:pid/:uid/comment', auth, postController.addComment);

// Route to delete a post by ID - protected
router.delete('/:id', auth, postController.deletePost);

router.post('/:id/share', auth, postController.sharePost);


export default router;
