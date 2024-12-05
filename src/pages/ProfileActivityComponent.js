import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { FaEdit, FaUserPlus, FaUserMinus, FaChartLine, FaUsers, FaUserFriends } from 'react-icons/fa';

const ProfileActivityComponent = React.memo(({ userId }) => {
  const { user, followUser, unfollowUser, userActivityDetails, fetchUserActivityDetails } = useContext(UserContext);
  const isCurrentUser = user && user._id === userId;
  const [isLoading, setIsLoading] = useState(false);
  const [error] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  console.log('ProfileActivityComponent: Entry', userId);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('profile')) {
      fetchUserActivityDetails(userId);
      if (userActivityDetails && userActivityDetails[userId] && user!=null) {
        setIsFollowing(userActivityDetails[userId].followers.includes(user._id)||userActivityDetails[user._id].following.includes(userId)); 
      }
    }
  }, [location.pathname, user]);

  const handleFollowToggle = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      isFollowing ? await unfollowUser(userId) : await followUser(userId);
      fetchUserActivityDetails(userId);
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
    setIsFollowing(!isFollowing);
    setIsLoading(false);
  };

  if (!userActivityDetails || !userActivityDetails[userId]) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-8 h-8 border-4 border-gray-400 border-t-white rounded-full"
        />
      </motion.div>
    );
  }

  const profileUser = userActivityDetails && userActivityDetails[userId];
  const postsCount = 1;
  if (!profileUser) {
    return;
  }

  const StatItem = ({ icon, value, label }) => (
    <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
      {icon}
      <p className="text-2xl font-bold text-white mt-2">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileHover={{ scale: 1.03 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <StatItem icon={<FaChartLine className="text-blue-400 text-2xl mx-auto" />} value={postsCount} label="Posts" />
        <StatItem icon={<FaUsers className="text-purple-400 text-2xl mx-auto" />} value={profileUser.followers?.length || 0} label="Followers" />
        <StatItem icon={<FaUserFriends className="text-green-400 text-2xl mx-auto" />} value={profileUser.following?.length || 0} label="Following" />
      </div>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        disabled={isLoading}
        className={`w-full py-3 rounded-lg flex items-center justify-center text-sm font-medium transition-colors duration-300
          ${isCurrentUser 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white' 
            : isFollowing 
              ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white' 
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleFollowToggle}
      >
        ```
                {isLoading ? 'Loading...' : (isCurrentUser ? null : (
                  <>{isFollowing ? <FaUserMinus className="mr-2" /> : <FaUserPlus className="mr-2" />}
          {isFollowing ? 'Unfollow' : 'Follow'}</>
        ))}
      </motion.button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </motion.div>
  );
});

export default React.memo(ProfileActivityComponent);
