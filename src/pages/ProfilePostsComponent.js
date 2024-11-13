import React, { useEffect } from 'react';
import { usePostContext } from '../context/PostContext';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { FaHeart, FaCommentDots, FaClock } from 'react-icons/fa';

const ProfilePostsComponent = React.memo(({ userId }) => {
  const { postDetails, fetchPosts } = usePostContext();
  const location = useLocation();

  console.log('ProfilePostsComponent: Entry', userId);
  console.log('Post details:', postDetails);

  useEffect(() => {
    if (location.pathname.includes('profile')) {
      fetchPosts(userId);
    }
  }, [location.pathname]);

  if (!postDetails) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-gray-400 text-center p-8 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl"
      >
        <FaCommentDots className="text-4xl mb-4 mx-auto text-blue-400" />
        <p className="text-lg">No posts available yet.</p>
      </motion.div>
    );
  }
  
  const posts = postDetails && postDetails[userId];
  console.log('Posts:', posts);
  if(!posts || posts.length === 0) {return; }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <h2 className="text-2xl font-bold mb-6 text-blue-400">Recent Posts</h2>
      <div className="space-y-6">
        {posts && posts.length>0 && posts.map((post) => (
          <motion.div
            key={post._id}
            whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" }}
            className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-6 rounded-xl shadow-lg cursor-pointer transition-all duration-300"
            
          >
            <div className="flex items-center text-gray-400 mb-3">
              <FaClock className="mr-2" />
              <p className="text-sm">
                {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <p className="text-gray-200 text-lg mb-4 line-clamp-3">{post.content}</p>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <div className="flex space-x-6">
                <span className="flex items-center">
                  <FaHeart className="mr-2 text-red-400" />
                  {post.likes?.length || 0}
                </span>
                <span className="flex items-center">
                  <FaCommentDots className="mr-2 text-blue-400" />
                  {post.comments?.length || 0}
                </span>
              </div>
              <motion.span 
                whileHover={{ scale: 1.02 }}
                className="text-blue-400 font-medium hover:underline"
              >
                Read More
              </motion.span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});

export default React.memo(ProfilePostsComponent);