import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

// Create the PostContext
const PostContext = createContext();

// Custom hook to use the PostContext
export const usePostContext = () => {
  return useContext(PostContext);
};

// PostProvider component
export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]); 
  const [postDetails, setPostDetails] = useState({}); // All posts by user
    //print post details map whhen it loads with useeffect
useEffect(() => {
    console.log('PostContext: Post details:', postDetails);
}, [postDetails]);

  
  // Function to fetch posts
  const fetchPosts = async (userId = 'NA') => {    
    try {
      let url = '/api/posts'; // Default URL to fetch all posts
      if (userId !== 'NA') {
        url = `/api/posts/${userId}`; // Fetch posts for specific user
      }
      
      const response = await axiosInstance.get(url);
      
      if(response.data.length === 0) return;
      
      if (userId === 'NA') {
        console.log('PostContext: Fetching all posts:', response.data);
        // If fetching all posts
        setPosts(response.data);
        
        // Organize posts by userId
        
      } else {
        // If fetching posts for a specific user
        console.log('PostContext: Fetching posts for user:', userId, response.data);
        setPostDetails((prevDetails) => ({
          ...prevDetails,
          [userId]: response.data,
        }));
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Function to add a new post
  const addPost = async (newPost) => {
    try {
      const response = await axiosInstance.post('/api/posts', newPost);
      if(response.data.post === undefined) return;
      const addedPost = response.data.post;
      console.log('PostContext: added posts:', response.data.post);
      
      // Update posts state
      setPosts((prevPosts) => [...prevPosts, addedPost]);
      
      // Update postDetails for the specific user
      setPostDetails((prevDetails) => {
        const userPosts = prevDetails[String(addedPost.user)] || [];
        return {
          ...prevDetails,
          [String(addedPost.user)]: [...userPosts, addedPost],
        };        
      });
      console.log('PostContext: Post details addpost:', postDetails);
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  // Function to like a post
  const likePost = async (postId, userId) => {
    try {
      const response = await axiosInstance.put(`/api/posts/${postId}/${userId}/like`);
      const updatedPosts = posts.map((post) =>
        post._id === postId ? { ...post, likes: response.data.likes } : post
      );
      setPosts(updatedPosts); // Update the posts state with the new like count
      console.log('PostContext: Post details likepost:', postDetails);
      // Update postDetails as well
      setPostDetails((prevDetails) => {
        const userPosts = prevDetails[userId] || [];
        const updatedUserPosts = userPosts.map((post) =>
          post._id === postId ? { ...post, likes: response.data.likes } : post
        );
        return {
          ...prevDetails,
          [userId]: updatedUserPosts,
        };
      });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  // Function to add a comment to a post
  const commentOnPost = async (postId, userId, comment) => {
    try {
      const response = await axiosInstance.post(`/api/posts/${postId}/${userId}/comment`, { comment });
      const updatedPosts = posts.map((post) =>
        post._id === postId ? { ...post, comments: response.data.comments } : post
      );
      setPosts(updatedPosts); // Update the posts state with the new comments

      // Update postDetails as well
      setPostDetails((prevDetails) => {
        const userPosts = prevDetails[userId] || [];
        const updatedUserPosts = userPosts.map((post) =>
          post._id === postId ? { ...post, comments: response.data.comments } : post
        );
        return {
          ...prevDetails,
          [userId]: updatedUserPosts,
        };
      });
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  // Value to be provided to components
  const value = {
    posts,
    addPost,
    fetchPosts,
    likePost,
    commentOnPost,
    postDetails,
  };

  return (
    <PostContext.Provider value={value}>
      {children} {/* Render children with access to context */}
    </PostContext.Provider>
  );
};
