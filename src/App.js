// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import HomeFeed from './pages/HomeFeed';
import Profile from './pages/Profile';
import { AuthProvider } from './context/UserContext';
import { PostProvider } from './context/PostContext';
import './App.css';

const App = () => {
    return (
        <AuthProvider>
            <PostProvider> {/* Wrap the application with PostProvider */}
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/homefeed/" element={<HomeFeed />} />
                        <Route path="/profile/:userId" element={<Profile />} />
                    </Routes>
                </Router>
            </PostProvider>
        </AuthProvider>
    );
};

export default App;
