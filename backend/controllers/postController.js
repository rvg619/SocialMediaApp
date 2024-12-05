// controllers/postController.js
 
import Post from '../models/Post.js'; 
import UserBio from '../models/UserBio.js';

const postController = {
  // Fetch all posts
  getPosts: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: -1 });
      console.log('Fetched posts:', posts); // Log posts data
      res.status(200).json(posts); // Send a 200 OK status code along with the data
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ message: 'Server error: Unable to fetch posts' });
    }
  },

  createPost: async (req, res) => {
    try {
      // Accessing the body of the request with 'request' instead of directly using 'req.body'
      const request = req.body;
  
      // Fetch the user from the User model based on the user ID
      const foundUser = await UserBio.findById(request.user);
      
      // If the user is not found, return a 404 error
      if (!foundUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Create a new post object with content, user ID, and username
      const newPost = new Post({
        content: request.content,    // Accessing 'content' from the request object
        user: request.user,          // Accessing 'user' from the request object
        username: foundUser.username, // Getting the username from the User model
      });
  
      // Save the new post to the database
      const savedPost = await newPost.save();
      console.log('Post created:', savedPost); // Log the saved post
      console.log('User updated:', foundUser); // Log the updated user
      // Return a success message along with the saved post
      res.status(201).json({
        message: 'Post created successfully',
        post: savedPost,
      });
    } catch (error) {
      // Log the error and return a 400 status with the error message
      console.error('Error creating post:', error);
      res.status(400).json({ message: error.message });
    }
  },
  getPostsByUserId: async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Find posts where the author matches the userId
      const posts = await Post.find({ user: userId });
  
      if (!posts) {
        return res.status(404).json({ message: 'No posts found for this user.' });
      }
  
      res.status(200).json(posts); // Return the posts
    } catch (error) {
      console.error('Error fetching posts by user ID:', error);
      res.status(500).json({ message: 'Server error: Unable to fetch posts by user' });
    }
  },

  // Fetch a specific post by ID
  getPostById: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json(post);
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ message: 'Server error: Unable to fetch post' });
    }
  },

  // Update a post by ID
  updatePost: async (req, res) => {
    try {
      const { content } = req.body;
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { content },
        { new: true } // Return the updated post
      );
      if (!updatedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json(updatedPost);
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ message: 'Server error: Unable to update post' });
    }
  },

  // Delete a post
  deletePost: async (req, res) => {
    try {
      const deletedPost = await Post.findByIdAndDelete(req.params.id);
      if (!deletedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ message: 'Server error: Unable to delete post' });
    }
  },

  toggleLikePost: async (req, res) => {
    try {
      const request = req.params; // Access the postId and userId from the URL params
      const pid = request.pid;
      const uid = request.uid;
      // Find the post using the postId
      const post = await Post.findById(pid);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Find the user using the userId (optional, you may already have user info through the auth middleware)
      const user = await UserBio.findById(uid);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if the user has already liked the post
      if (post.likes.includes(uid)) {
        // If the user already liked the post, remove the like (unlike)
        post.likes = post.likes.filter(like => like.toString() !== uid);
      } else {
        // If the user hasn't liked the post, add the userId to the likes array
        post.likes.push(uid);
      }

      // Save the post with the updated likes
      await post.save();

      // Return the updated total number of likes
      res.status(200).json({ 
        message: 'Like status toggled successfully', 
        totalLikes: post.likes.length, // Send the total likes
        post
      });
    } catch (error) {
        console.error('Error toggling like on post:', error);
        res.status(500).json({ message: 'Error toggling like on post' });
    }
  },
  addComment: async (req, res) => {
    try {
      const { pid, uid } = req.params; // Extract postId and userId from params
      const { comment } = req.body; // Get the content of the comment from the request body

      // Find the post by ID
      const post = await Post.findById(pid);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Find the user by ID
      const user = await UserBio.findById(uid);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Create a new comment object based on the schema
      const newComment = {
        content: comment,    // Comment content from the request body
        author: user.username, // Store the user ID in the comment's author field
      };

      // Push the new comment into the post's comments array
      post.comments.push(newComment);

      // Save the post with the new comment
      await post.save();

      // Return the updated post with the new comment
      res.status(200).json({
        message: 'Comment added successfully',
        post,  // The updated post with comments
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ message: 'Error adding comment to post' });
    }
  },
  sharePost: async (req, res) => {
    try {
        const { id } = req.params; // Post ID from URL
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.shares += 1; // Increment the share count
        await post.save();

        res.status(200).json({ message: 'Post shared successfully', post });
    } catch (error) {
        console.error('Error sharing post:', error);
        res.status(500).json({ message: 'Server error: Unable to share post' });
    }
  },

  // Fetch all posts (for admin)
  getAllPosts: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: -1 });
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ message: 'Server error: Unable to fetch posts' });
    }
  },

  // Delete a post (already exists but ensure it's accessible by admin)
  deletePost: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedPost = await Post.findByIdAndDelete(id);
      if (!deletedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ message: 'Server error: Unable to delete post' });
    }
  },

};



export default postController;
