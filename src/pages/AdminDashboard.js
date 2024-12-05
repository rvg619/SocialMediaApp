import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSignOutAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const adminToken = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const usersResponse = await axios.get('/api/admin/users', {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        setUsers(usersResponse.data);

        const postsResponse = await axios.get('/api/admin/posts', {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        setPosts(postsResponse.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchAdminData();
  }, [adminToken]);

  const handleSignOut = () => {
    localStorage.removeItem('adminToken'); // Clear admin token from localStorage
    navigate('/admin/login'); // Redirect to admin login page
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`/api/admin/posts/${postId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Admin Dashboard Header */}
      <nav className="bg-gray-800 p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-400">Admin Dashboard</h1>
        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full flex items-center"
        >
          <FaSignOutAlt className="text-xl mr-2" />
          Sign Out
        </button>
      </nav>

      <div className="p-8">
        {/* Users Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Users</h2>
          <table className="w-full table-auto bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-700">
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Posts Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Posts</h2>
          <table className="w-full table-auto bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Content</th>
                <th className="px-4 py-2 text-left">Author</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id} className="border-b border-gray-700">
                  <td className="px-4 py-2">{post.content}</td>
                  <td className="px-4 py-2">{post.username}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
