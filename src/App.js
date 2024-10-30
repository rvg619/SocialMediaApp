// src/App.js
import React, { useState, useEffect } from 'react'; // Importing useState and useEffect
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import HomeFeed from './pages/HomeFeed'; // Ensure this matches your file name
import NewPost from './pages/NewPost';
import axios from 'axios';

const App = () => {
    const [posts, setPosts] = useState([]); // Define posts state

    // Function to fetch posts from the API
    const fetchPosts = async () => {
        try {
            const response = await axios.get('/api/posts'); // Replace with your API endpoint
            setPosts(response.data); // Update the posts state with the fetched data
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    // Effect to fetch posts on initial render
    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                    path="/homefeed" 
                    element={<HomeFeed posts={posts} fetchPosts={fetchPosts} />} 
                />
                <Route 
                    path="/new-post" 
                    element={<NewPost onPostCreated={fetchPosts} />} 
                />
                {/* Add more routes here, like Profile, Messages, etc. */}
            </Routes>
        </Router>
    );
};

export default App;
