// routes/userRoutes.js

import express from 'express';
import userController from '../controllers/userController.js';
import auth from '../middleware/Auth.js';

const router = express.Router();

// Routes related to userBioDetails
router.post('/register', userController.registerUser); // Registration and creates userBioDetails
router.post('/login', userController.loginUser);       // Login route

// Fetch the current user's bio details
router.get('/', auth, userController.getCurrentuserBioDetails); 
// Fetch a specific user's bio details by ID
router.get('/:id', auth, userController.getuserBioDetailsDetails);

// Routes related to userActivityDetails (Followers/Following)
router.get('/activity/:id', auth, userController.getuserActivityDetails); // Fetch user activity by userId
router.post('/:id/follow', auth, userController.followUser);       // Follow a user
router.post('/:id/unfollow', auth, userController.unfollowUser);   // Unfollow a user

// Routes related to userPostsDetails
router.get('/posts/:id', auth, userController.getuserPostsDetails); // Fetch user's posts by userId
router.post('/posts', auth, userController.createPost);      // Create a new post for the authenticated user

export default router;
