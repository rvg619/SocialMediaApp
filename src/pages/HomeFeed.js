// src/pages/HomeFeed.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeFeed = ({ posts, fetchPosts }) => {
    const navigate = useNavigate();

    const handleSignOut = () => {
        // Implement sign-out logic, e.g., clear auth tokens
        // After signing out, redirect to home or login page
        navigate('/');
    };

    return (
        <div className="bg-black min-h-screen text-white p-8">
            {/* Navigation Bar */}
            <nav className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-blue-400">BlogCentral</h1>
                <div className="flex space-x-4">
                    <button 
                        onClick={() => navigate('/notifications')}
                        className="text-gray-300 hover:text-white"
                    >
                        Notifications
                    </button>
                    <button 
                        onClick={() => navigate('/profile')}
                        className="text-gray-300 hover:text-white"
                    >
                        Profile
                    </button>
                    <button 
                        onClick={handleSignOut}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Sign Out
                    </button>
                </div>
            </nav>

            {/* Create New Post Button */}
            <div className="mb-6">
                <button 
                    onClick={() => navigate('/new-post')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Create New Post
                </button>
            </div>

            {/* Posts Section */}
            <div className="space-y-4">
                {posts.length === 0 ? (
                    <p className="text-gray-400">No posts available. Start creating some!</p>
                ) : (
                    posts.map((post) => (
                        <div key={post.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                            <p className="text-lg">{post.content}</p>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-gray-500 text-sm">Posted on: {new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HomeFeed;
