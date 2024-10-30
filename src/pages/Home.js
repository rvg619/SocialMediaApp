// src/pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-black min-h-screen text-white flex items-center justify-center p-8">
      {/* Container for the title, buttons, and description */}
      <div className="max-w-3xl flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">

        {/* Left Side: BlogCentral Heading and Buttons */}
        <div className="text-left">
          <h1 className="text-5xl font-extrabold text-blue-400 mb-4">
            BlogCentral
          </h1>

          {/* Login/Register Buttons */}
          <div className="flex space-x-4 mb-4">
            <button 
              onClick={() => navigate('/login')}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
            >
              Register
            </button>
          </div>
        </div>

        {/* Right Side: Description */}
        <p className="text-gray-300 text-lg max-w-md leading-relaxed">
          Discover, share, and engage with ideas that inspire you. BlogCentral is your platform to explore stories, insights, and perspectives from across the globe.
        </p>
        
      </div>
    </div>
  );
};

export default Home;
