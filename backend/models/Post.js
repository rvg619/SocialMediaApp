// models/Post.js

import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define a schema for comments
const commentSchema = new Schema(
  {
    author: {
      type: String,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false } // Prevents Mongoose from creating an extra _id for each comment
);

// Define the main post schema
const postSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      ref: 'User',
      equired: true,
    },
    likes: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      default: [], // Default to an empty array if no users have liked the post
    },
    comments: {
      type: [commentSchema], // Array of comments using the defined schema
      default: [], // Default to an empty array if no comments
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

export default mongoose.model('Post', postSchema);
