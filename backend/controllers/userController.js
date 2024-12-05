import UserBio from '../models/UserBio.js';
import UserActivity from '../models/UserActivity.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userController = {
    // Register a new user and create their bio
    registerUser: async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const JWT_SECRET = 'mySuperSecretKey123!@#';

            let user = await UserBio.findOne({ email });
            if (user) {
                return res.status(400).json({ success: false, message: 'User already exists' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create userBio
            user = new UserBio({
                username,
                email,
                password: hashedPassword,
            });
            await user.save();

            // Create userActivity entry
            const userActivity = new UserActivity({ userId: user._id });
            await userActivity.save();

            const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

            res.status(201).json({ success: true, token, userbio: user });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Login user
    loginUser: async (req, res) => {
        try {
            const request = req.body;
            const email = request.email;
            const password = request.password;
            const JWT_SECRET = 'mySuperSecretKey123!@#';

            const user = await UserBio.findOne({ email });
            if (!user) {
                return res.status(400).json({ success: false, message: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Invalid credentials' });
            }
            console.log('User:', user);
            if (!user._id) {
                return res.status(400).json({ success: false, message: 'Invalid user ID' });
            }

            const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

            res.json({ success: true, token, userbio: user });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },    


    // Get the current user's bio details
    getCurrentuserBioDetails: async (req, res) => {
        try {
            const user = await UserBio.findById(req.user.userId);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            res.status(200).json({ success: true, bio: user });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Get a specific user's bio details by ID
    getuserBioDetailsDetails: async (req, res) => {
        try {
            const id = req.params.id;
            const user = await UserBio.findById(id);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            res.status(200).json({ success: true, bio: user });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Get user activity details (followers and following)
    getuserActivityDetails: async (req, res) => {
        try {
            const userActivity = await UserActivity.findOne({ userId: req.params.id });
            if (!userActivity) {
                return res.status(404).json({ success: false, message: 'User activity not found' });
            }

            res.status(200).json({ success: true, activity: userActivity });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Follow a user
    followUser: async (req, res) => {
        try {
            const userId = req.user.userId;
            const targetUserId = req.params.id;

            const targetUser = await UserBio.findById(targetUserId);
            if (!targetUser) {
                return res.status(404).json({ success: false, message: 'Target user not found' });
            }
            const userActivity = await UserActivity.findOne({ userId });
            const targetUserActivity = await UserActivity.findOne({ userId: targetUserId });
            if (userId === targetUserId) {
                return res.status(400).json({ success: false, message: "You can't follow yourself" ,usersMap: {
                    activity: userActivity,
                    targetActivity: targetUserActivity
                } });
            }

            
            if (userActivity.following.includes(targetUserId)) {
                return res.status(200).json({ success: true, message: 'You are already following this user', usersMap: { activity: userActivity } });
            }

            // Add target user to the following list of the logged-in user
            userActivity.following.push(targetUserId);
            await userActivity.save();

            // Add logged-in user to the followers list of the target user
            
            targetUserActivity.followers.push(userId);
            await targetUserActivity.save();

            // Return the updated user activity details
            res.status(200).json({
                success: true,
                message: 'User followed successfully',
                usersMap: {
                    activity: userActivity,
                    targetActivity: targetUserActivity
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Unfollow a user
    unfollowUser: async (req, res) => {
        try {
            const userId = req.user.userId;
            const targetUserId = req.params.id;

            const targetUser = await UserBio.findById(targetUserId);
            if (!targetUser) {
                return res.status(404).json({ success: false, message: 'Target user not found' });
            }

            if (userId === targetUserId) {
                return res.status(400).json({ success: false, message: "You can't unfollow yourself" });
            }

            const userActivity = await UserActivity.findOne({ userId });
            const targetUserActivity = await UserActivity.findOne({ userId: targetUserId });
            if (!userActivity.following.includes(targetUserId)) {
                return res.status(400).json({ success: false, message: 'You are not following this user',usersMap: {
                    activity: userActivity,
                    targetActivity: targetUserActivity
                } });
            }

            // Remove target user from the following list of the logged-in user
            userActivity.following = userActivity.following.filter(id => id.toString() !== targetUserId);
            await userActivity.save();

            // Remove logged-in user from the followers list of the target user
            
            targetUserActivity.followers = targetUserActivity.followers.filter(id => id.toString() !== userId);
            await targetUserActivity.save();

            // Return the updated user activity details
            res.status(200).json({
                success: true,
                message: 'User unfollowed successfully',
                usersMap: {
                    activity: userActivity,
                    targetActivity: targetUserActivity
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },


    // Fetch user posts
    getuserPostsDetails: async (req, res) => {
        try {
            const userPosts = await UserPosts.findOne({ userId: req.params.id });
            if (!userPosts) {
                return res.status(404).json({ success: false, message: 'User posts not found' });
            }

            res.status(200).json({ success: true, posts: userPosts.posts });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Create a post for the authenticated user
    createPost: async (req, res) => {
        try {
            const { content } = req.body;

            const userPosts = await UserPosts.findOne({ userId: req.user.userId });
            if (!userPosts) {
                return res.status(404).json({ success: false, message: 'User posts not found' });
            }

            userPosts.posts.push({ content });
            await userPosts.save();

            res.status(201).json({ success: true, message: 'Post created successfully' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

    // Fetch all user details (bio, activity, posts)
    getAllUserDetails: async (req, res) => {
        try {
            const { id } = req.params;

            const userBio = await UserBio.findById(id);
            if (!userBio) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            const userActivity = await UserActivity.findOne({ userId: id });
            const userPosts = await UserPosts.findOne({ userId: id });

            const response = {
                bio: userBio,
                activity: userActivity ? { followers: userActivity.followers, following: userActivity.following } : { followers: [], following: [] },
                posts: userPosts ? userPosts.posts : [],
            };

            res.status(200).json({ success: true, ...response });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

        // Fetch all users (for admin)
    getAllUsers: async (req, res) => {
        try {
        const users = await UserBio.find();
        res.status(200).json(users);
        } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error: Unable to fetch users' });
        }
    },

    // Delete a user (for admin)
    deleteUser: async (req, res) => {
        try {
        const { id } = req.params;
        await UserBio.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error: Unable to delete user' });
        }
    },
};

export default userController;
