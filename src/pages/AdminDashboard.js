// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
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
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Users</h2>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-gray-700">
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Posts</h2>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-2">Content</th>
              <th className="px-4 py-2">Author</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post._id} className="border-b border-gray-700">
                <td className="px-4 py-2">{post.content}</td>
                <td className="px-4 py-2">{post.username}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete Post
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboard;
