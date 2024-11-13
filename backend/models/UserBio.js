// models/userBioDetails.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const userBioDetailsSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,  // This ensures the password is required for registration
    },
    bio: {
      type: String,
      default: '',
    },
    profilePicture: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
    location: {
      type: String,
      default: 'N/A',
    },
    job: {
      type: String,
      default: 'N/A',
    },
    education: {
      type: String,
      default: 'N/A',
    },
  },
  { timestamps: true }
);

export default mongoose.model('userBioDetails', userBioDetailsSchema);
