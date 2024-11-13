import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

// Create the context
export const UserContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Breaking userDetails into userBioDetails and userActivityDetails
    const [userBioDetails, setUserBioDetails] = useState({});
    const [userActivityDetails, setUserActivityDetails] = useState({});
    const [isFollowing, setIsFollowing] = useState(false);


   // Fetch details of a specific user by ID
    const fetchUserBioDetails = async (userId) => {
        
    
        try {
            console.log('fetchUserBioDetails: Fetching bio details for:', userId);
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get(`/api/users/${userId}`);
            if(response.data.bio === undefined) return;
            const { bio } = response.data;
    
            // Set the fetched bio data
            setUserBioDetails((prevBio) => ({ ...prevBio, [userId]: bio }));
        } catch (err) {
            setError('Error fetching bio details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    const fetchUserActivityDetails = async (userId) => {
        console.log('fetchUserActivityDetails: Fetching activity details for:', userId);
        setLoading(true);
        setError(null);
    
        try {
            const response = await axiosInstance.get(`/api/users/activity/${userId}`);
            if(response.data.activity === undefined) return;
            const { activity } = response.data;
    
            // Set the fetched activity data
            setUserActivityDetails((prevActivity) => ({ ...prevActivity, [userId]: activity }));
        } catch (err) {
            setError('Error fetching activity details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    

    // Login function
    const login = async (email, password) => {
        try {
            setError(null);
            const response = await axiosInstance.post('/api/users/login', { email, password });
            const results = response.data;

            // Save user details and token to localStorage
            localStorage.setItem('user', JSON.stringify(results.userbio)); // Storing user bio
            localStorage.setItem('token', results.token); // Storing the token

            // Update user and userBioDetails state
            setUser(results.userbio); // Set the current user in context
            const userId = String(results.userbio._id); // Extract user ID from the response
           // Initialize or update userBioDetails and userActivityDetails maps
            setUserBioDetails((prevBio) => ({
                ...prevBio,
                [userId]: response.data, // Add the user object under the userId key
            }));

            setUserActivityDetails((prevActivity) => ({
                ...prevActivity,
                [userId]: {
                    userId, // Ensure the userId is set in the activity details
                    followers: [], // Initialize followers as an empty array
                    following: [], // Initialize following as an empty array
                },
            }));
        } catch (error) {
            setError(error.response?.data.message || 'Login failed');
            throw new Error(error.response?.data.message || 'Login failed');
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    // Follow a user
    const followUser = async (userId) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(`/api/users/${userId}/follow`);

            // Assuming response.data.usersMap contains a map of userId: user
            if (response.data.usersMap) {
                setUserActivityDetails(response.data.usersMap.activity);
            }
        } catch (error) {
            setError('Error following user');
            console.error(error);
        } finally {            
            setIsFollowing(!isFollowing);
            setLoading(false);
        }
    };

    // Unfollow a user
    const unfollowUser = async (userId) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post(`/api/users/${userId}/unfollow`);
            if (response.data.usersMap) {
                setUserActivityDetails(response.data.usersMap.activity);
            }
        } catch (error) {
            setError('Error unfollowing user');
            console.error(error);
        } finally {            
            setIsFollowing(!isFollowing);
            setLoading(false);
        }
    };

    // Expose context values
    const exposedProps = {
        user,
        login,
        logout,
        loading,
        error,
        setUser,
        fetchUserBioDetails,
        userBioDetails,
        userActivityDetails,
        followUser,
        unfollowUser,
        isFollowing,
        fetchUserActivityDetails,
    };

    return (
        <UserContext.Provider value={exposedProps}>
            {children}
        </UserContext.Provider>
    );
};
