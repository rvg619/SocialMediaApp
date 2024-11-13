// src/pages/Login.js
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Login = () => {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Optional: Track login status

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true); // Set logging in status

    console.log('Attempting to log in with:', { email, password }); // Log the email and password

    try {
      await login(email, password);
      console.log('Login successful'); // Log success
      navigate(`/homefeed`); // Navigate after successful login
    } catch (err) {
      console.error('Login error:', err); // Log the error for debugging
      setError(err.message); // Set the error message
    } finally {
      setIsLoggingIn(false); // Reset logging in status
    }
  };

  return (
    <div className="bg-black min-h-screen text-white flex items-center justify-center p-8">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full space-y-6">
        <h2 className="text-4xl font-extrabold text-blue-400 text-center">Login to BlogCentral</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
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
          <button
            type="submit"
            disabled={isLoggingIn} // Disable button while logging in
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            {isLoggingIn ? 'Logging In...' : 'Log In'}
          </button>
        </form>
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
