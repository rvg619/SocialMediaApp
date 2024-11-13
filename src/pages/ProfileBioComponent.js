import React, { useContext, useEffect, useState, useMemo } from 'react'; 
import { UserContext } from '../context/UserContext';
import { useLocation } from 'react-router-dom';
import { FaMapMarkerAlt, FaBriefcase, FaUniversity } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ProfileBioComponent = React.memo(({ userId }) => {
  const { userBioDetails, fetchUserBioDetails } = useContext(UserContext);
  const [localLoading, setLocalLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('profile')) {
      fetchUserBioDetails(userId);
    }
  }, [location.pathname]);

  if (localLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full"
        />
      </div>
    );
  }

  if (!userBioDetails || !userBioDetails[userId]) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400">No user data available</p>
      </div>
    );
  }

  const data = userBioDetails[userId];
  if (!data) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto p-10 rounded-xl bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-2xl"
    >
      <div className="flex flex-col md:flex-row items-center md:items-start mb-10">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative mb-8 md:mb-0"
        >
          <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-7xl font-bold">
            {data.username?.[0] || '?'}
          </div>
        </motion.div>
        <div className="text-center md:text-left md:ml-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-3">
            {data.username}
          </h1>
          <p className="text-xl text-blue-300 font-medium mb-4">@{data.username}</p>
          <p className="mt-4 text-lg text-gray-300 italic max-w-2xl">
            {data.bio || '"A journey of a thousand miles begins with a single step."'}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap justify-center md:justify-start gap-5 mt-8">
        {data.location && (
          <motion.div
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.3)' }}
            className="flex items-center bg-gray-700 bg-opacity-50 rounded-full px-6 py-3 text-base text-gray-200"
          >
            <FaMapMarkerAlt className="mr-3 text-blue-400 text-xl" />
            <span>{data.location}</span>
          </motion.div>
        )}
        {data.occupation && (
          <motion.div
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.3)' }}
            className="flex items-center bg-gray-700 bg-opacity-50 rounded-full px-6 py-3 text-base text-gray-200"
          >
            <FaBriefcase className="mr-3 text-blue-400 text-xl" />
            <span>{data.occupation}</span>
          </motion.div>
        )}
        {data.education && (
          <motion.div
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.3)' }}
            className="flex items-center bg-gray-700 bg-opacity-50 rounded-full px-6 py-3 text-base text-gray-200"
          >
            <FaUniversity className="mr-3 text-blue-400 text-xl" />
            <span>{data.education}</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

export default ProfileBioComponent;
