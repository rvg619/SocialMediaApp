// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Logic to handle login (e.g., API call)
                
    navigate('/homefeed'); // Redirect to home or dashboard upon successful login
  };

  return (
    <div className="bg-black min-h-screen text-white flex items-center justify-center p-8">
      {/* Login Form Container */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full space-y-6">
        
        {/* Title */}
        <h2 className="text-4xl font-extrabold text-blue-400 text-center">
          Login to BlogCentral
        </h2>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 p-2 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 p-2 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Log In
          </button>
        </form>

        {/* Redirect to Register */}
        <p className="text-center text-gray-400">
          Don’t have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-blue-400 hover:underline"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
