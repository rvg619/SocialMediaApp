// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance'; // Ensure you're importing axios

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(''); // State to hold error messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(''); // Clear error message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/users/register', formData);
      console.log('Registration successful:', response.data);
      navigate('/login'); // Redirect to homefeed after successful registration
    } catch (error) {
      console.error("Registration error:", error.response.data);
      // Display the error message from the server
      setError(error.response.data.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">Create an Account</h1>
      <p className="mb-6 text-gray-300 text-center max-w-md">
        Join BlogCentral to share your thoughts, connect with others, and stay updated with the latest posts.
      </p>
      {error && <div className="text-red-500 mb-4">{error}</div>} {/* Display error messages */}
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded"
        >
          Register
        </button>
      </form>
      <p className="mt-4 text-gray-400">
        Already have an account?{' '}
        <span
          onClick={() => navigate('/login')}
          className="text-blue-500 hover:underline cursor-pointer"
        >
          Log in
        </span>
      </p>
    </div>
  );
};

export default Register;
