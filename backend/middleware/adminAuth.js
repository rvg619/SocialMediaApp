// middleware/adminAuth.js
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const adminAuth = async (req, res, next) => {
  // Extract token from Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify token using a separate secret key for admins
    const decoded = jwt.verify(token, 'yourAdminJWTSecretKey');
    const admin = await Admin.findById(decoded.adminId);

    if (!admin) {
      return res.status(403).json({ message: 'Access denied. Invalid token.' });
    }

    req.admin = admin; // Attach admin to request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(403).json({ message: 'Access denied. Invalid token.' });
  }
};

export default adminAuth;
