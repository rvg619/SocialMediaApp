// middleware/auth.js

import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  // Extract the token from the Authorization header and remove "Bearer "
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  // Check if token exists
  if (!token) {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    // Verify token using the secret key
    const decoded = jwt.verify(token, 'mySuperSecretKey123!@#');

    // Attach decoded token data (e.g., user ID) to the request object
    req.user = decoded;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    // If token verification fails, respond with a 403 status
    res.status(403).json({ error: 'Invalid token' });
  }
};

export default auth;
