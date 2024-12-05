import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHome } from 'react-icons/fa';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/admin/login', { email, password });
      localStorage.setItem('adminToken', response.data.token);
      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const goToHomePage = () => {
    navigate('/');
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-8">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-4">Admin Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 bg-gray-700 text-white rounded"
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 bg-gray-700 text-white rounded"
          />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded">
            Login
          </button>
        </form>

        {/* Button to Go to Home Page */}
        <button
          onClick={goToHomePage}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white p-3 rounded mt-4 flex items-center justify-center space-x-2"
        >
          <FaHome className="text-lg" />
          <span>Go to Home</span>
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
