// db/connectDB.jss
import mongoose from 'mongoose';
const URI='mongodb+srv://lawry1998:Tf9jeGN2TlANhjj2@cluster0.ckzd0bt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
import Admin from '../models/Admin.js';

const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: 'admin@example2.com' });
    if (!existingAdmin) {
      const defaultAdmin = new Admin({
        username: 'admin12345678',
        email: 'admin@example2.com',
        password: 'securepassword123', // Use a strong password
      });
      await defaultAdmin.save();
      console.log('Default admin created successfully!');
    } else {
      console.log('Admin already exists. Skipping creation.');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await createDefaultAdmin();
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
