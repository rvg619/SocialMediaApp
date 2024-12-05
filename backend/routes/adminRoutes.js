// routes/adminRoutes.js
import express from 'express';
import adminController from '../controllers/adminController.js';
import adminAuth from '../middleware/adminAuth.js';
import userController from '../controllers/userController.js';
import postController from '../controllers/postController.js';

const router = express.Router();

// Admin authentication routes
// Note: Register route can be omitted if you prefer to create admins manually
router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);

// Protected admin routes
router.get('/users', adminAuth, userController.getAllUsers);
router.delete('/users/:id', adminAuth, userController.deleteUser);
router.get('/posts', adminAuth, postController.getAllPosts);
router.delete('/posts/:id', adminAuth, postController.deletePost);

// Add more admin routes as needed

export default router;
