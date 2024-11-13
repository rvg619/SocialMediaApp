import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { usePostContext } from '../context/PostContext';
import { FaHeart, FaCommentDots, FaClock, FaBell, FaUser, FaSignOutAlt, FaPlusCircle, FaShare, FaBookmark, FaMapMarkerAlt, FaSmile, FaPaperclip, FaPaperPlane, FaImage } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const HomeFeed = () => {
  const navigate = useNavigate();
  const { user, setUser} = useContext(UserContext);
  const { posts, fetchPosts, likePost, commentOnPost, sharePost, savePost, addPost } = usePostContext();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [likingPost, setLikingPost] = useState(null);
  const [commentingPost, setCommentingPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [openComments, setOpenComments] = useState({});
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [postError, setPostError] = useState(null);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    const loadPosts = async () => {
      console.log('HomeFeed: Loading posts');
      setLoading(true);
      await fetchPosts();
      setLoading(false);
    };

    if (location.pathname === '/homefeed') {
      loadPosts();
    }
  }, [location.pathname]);

  const handleLikeClick = async (postId, userId) => {
    if (likingPost === postId) return;
    setLikingPost(postId);
    try {
      await likePost(postId, userId);
      await fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setLikingPost(null);
    }
  };

  const handleCommentClick = (postId) => {
    setOpenComments(prevState => ({
      ...prevState,
      [postId]: !prevState[postId]
    }));
    if (!openComments[postId]) {
      setCommentingPost(postId);
    } else {
      setCommentingPost(null);
    }
  };

  const handleCommentPost = async () => {
    if (!newComment.trim()) return;
    try {
      await commentOnPost(commentingPost, user._id, newComment);
      setNewComment('');
      await fetchPosts();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleUsernameClick = async (userId) => {        
    console.log('homefeed User ID:', userId);
    navigate(`/profile/${userId}`);
  };

  const handleNewPostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    setIsSubmittingPost(true);
    setPostError(null);
    try {
      await addPost({ content: newPostContent, user: user._id, username: user.username });
      setNewPostContent('');
      await fetchPosts();
    } catch (error) {
      setPostError("Failed to create post. Please try again.");
      console.error('Error creating post:', error);
    } finally {
      setIsSubmittingPost(false);
    }
  };
  return (
    <div className="bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen text-white">
      <nav className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <motion.h1 
            className="text-3xl font-bold text-blue-400 hover:text-blue-500 cursor-pointer"
            onClick={() => navigate('/homefeed')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            BlogCentral
          </motion.h1>
          <div className="flex space-x-6">        
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(`/profile/${user._id}`)}
              className="text-gray-300 hover:text-white transition duration-300"
            >
              <FaUser className="text-xl" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSignOut} 
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
            >
              <FaSignOutAlt className="text-xl" />
            </motion.button>
          </div>
        </div>
      </nav>
  
      <div className="container mx-auto px-4 py-8">
        {user && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-gray-300 text-lg"
          >
            Welcome, <span className="font-semibold text-blue-400">{user.username}</span>!
          </motion.div>
        )}
  
        {/* New Post Creation */}
        <motion.div 
          className="mb-8 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleNewPostSubmit}>
            <textarea
              className="w-full p-3 bg-gray-700 bg-opacity-50 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              rows="3"
            />
            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-4">
                <FaImage className="text-gray-400 cursor-pointer hover:text-blue-400 transition duration-200" />
                <FaSmile className="text-gray-400 cursor-pointer hover:text-blue-400 transition duration-200" />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 flex items-center"
                disabled={isSubmittingPost}
              >
                <FaPaperPlane className="mr-2" />
                {isSubmittingPost ? 'Posting...' : 'Post'}
              </motion.button>
            </div>
          </form>
        </motion.div>
  
        {loading ? (
          <div className="text-center py-8">
            <motion.div 
              className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="mt-4 text-gray-400">Loading posts...</p>
          </div>
        ) : !posts ? (
          <p className="text-center text-gray-400 py-8">No posts available. Start creating some!</p>
        ) : (
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <AnimatePresence>
              {posts && posts.map((post) => (post && 
                <motion.div
                  key={post._id}
                  className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-lg transition duration-300 hover:shadow-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-xl font-bold">
                        {post?.username?.[0] || '?'}
                      </div>
                      <div>
                        <button 
                          onClick={() => handleUsernameClick(post.user)}
                          className="font-semibold text-white text-lg hover:underline"
                        >
                          {post?.username || 'Unknown'}
                        </button>
                        <div className="flex items-center text-gray-400 text-sm">
                          <FaClock className="mr-1" />
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <p className="text-lg mb-6 leading-relaxed">{post.content}</p>
  
                  <div className="flex justify-between items-center text-gray-400 mt-4 pt-3 border-t border-gray-700">
                    <div className="flex space-x-6">
                      <motion.button 
                        onClick={() => handleLikeClick(post._id, user._id)}
                        disabled={likingPost === post._id}
                        className={`flex items-center space-x-2 transition-colors duration-200 ${likingPost === post._id ? 'text-gray-500' : 'hover:text-red-500'}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaHeart className={`text-xl ${post.likes && post.likes.includes(user._id) ? 'text-red-500' : ''}`} />
                        <span>{post.likes && post.likes.length}</span>
                      </motion.button>
  
                      <motion.button 
                        onClick={() => handleCommentClick(post._id)}
                        className="flex items-center space-x-2 transition-colors duration-200 hover:text-blue-500"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaCommentDots className="text-xl" />
                        <span>{post.comments && post.comments.length}</span>
                      </motion.button>
  
                      <motion.button 
                        onClick={() => sharePost(post._id)}
                        className="flex items-center space-x-2 transition-colors duration-200 hover:text-green-500"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaShare className="text-xl" />
                        <span>Share</span>
                      </motion.button>
  
                      <motion.button 
                        onClick={() => savePost(post._id)}
                        className="flex items-center space-x-2 transition-colors duration-200 hover:text-yellow-500"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaBookmark className="text-xl" />
                        <span>Save</span>
                      </motion.button>
                    </div>
                  </div>
  
                  <AnimatePresence>
                    {openComments[post._id] && (
                      <motion.div 
                        className="mt-6 pt-4 border-t border-gray-700"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <h4 className="text-lg font-semibold mb-4">Comments</h4>
                        {post.comments && post.comments.length > 0 ? (
                          <div className="space-y-4">
                            {post.comments.map((comment, index) => (
                              <motion.div 
                                key={index} 
                                className="bg-gray-700 bg-opacity-50 p-3 rounded-lg"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-sm font-semibold text-blue-400">{comment.author || 'Anonymous'}</span>
                                  <span className="text-xs text-gray-500">• {new Date(comment.createdAt).toLocaleString()}</span>
                                </div>
                                <p className="text-gray-300">{comment.content}</p>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400">No comments yet. Be the first to comment!</p>
                        )}
  
                        <div className="mt-4">
                          <textarea
                            className="w-full p-3 bg-gray-700 bg-opacity-50 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            placeholder="Write your comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows="3"
                          />
                          <motion.button
                            onClick={handleCommentPost}
                            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Post Comment
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HomeFeed;