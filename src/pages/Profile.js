import React from 'react';
import ProfileBioComponent from './ProfileBioComponent';
import ProfileActivityComponent from './ProfileActivityComponent';
import ProfilePostsComponent from './ProfilePostsComponent';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaHome } from 'react-icons/fa';

const Profile = () => {
  const userId = String(useParams().userId);
  const navigate = useNavigate();
  console.log('UserProfilePage userId:', userId);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  // Function to handle back navigation
  const handleBackClick = () => {
    navigate('/homefeed');
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className="bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 min-h-screen text-white"
    >
            {/* Modified and Adjusted Back Button */}
            <motion.button
          onClick={handleBackClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-blue-500 p-3 rounded-full flex items-center justify-center"
          style={{ width: '48px', height: '48px' }} // Adjust size
        >
          <FaHome className="text-white text-xl" /> {/* Increased icon size */}
        </motion.button>
      <div className="container mx-auto px-4 py-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ staggerChildren: 0.2 }}
          className="space-y-8"
        >
          <motion.div
            variants={pageVariants}
            className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-xl"
          >
            <ProfileBioComponent userId={userId} />
          </motion.div>
          <motion.div
            variants={pageVariants}
            className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-xl"
          >
            <ProfileActivityComponent userId={userId} />
          </motion.div>
          <motion.div
            variants={pageVariants}
            className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-xl"
          >
            <ProfilePostsComponent userId={userId} />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;
