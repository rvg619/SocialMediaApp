// controllers/adminController.js
import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

const adminController = {
  // Admin registration (optional, can be handled internally)
  registerAdmin: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const existingAdmin = await Admin.findOne({ email });

      if (existingAdmin) {
        return res.status(400).json({ message: 'Admin already exists' });
      }

      const admin = new Admin({ username, email, password });
      await admin.save();

      const token = jwt.sign({ adminId: admin._id }, 'yourAdminJWTSecretKey', { expiresIn: '1h' });

      res.status(201).json({ token, admin });
    } catch (error) {
      res.status(500).json({ message: 'Server error during admin registration' });
    }
  },

  // Admin login
  loginAdmin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email });

      if (!admin || !(await admin.matchPassword(password))) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ adminId: admin._id }, 'yourAdminJWTSecretKey', { expiresIn: '1h' });

      res.status(200).json({ token, admin });
    } catch (error) {
      res.status(500).json({ message: 'Server error during admin login' });
    }
  },
};

export default adminController;
