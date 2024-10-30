// src/pages/NewPost.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NewPost = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            navigate('/homefeed');
            await axios.post('/api/posts', { content }); // Replace with your API endpoint to create a new post
            onPostCreated(); // Call the function to fetch new posts
             // Navigate back to the home feed after posting
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    return (
        <div className="bg-black min-h-screen text-white p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-blue-400 mb-6">Create a New Post</h1>
                <form onSubmit={handleSubmit}>
                    <textarea
                        className="bg-gray-700 text-gray-300 p-4 rounded w-full h-48"
                        placeholder="What's on your mind?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                    <button 
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                    >
                        Post
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewPost;
