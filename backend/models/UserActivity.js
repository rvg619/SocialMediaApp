// models/userActivityDetails.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const userActivityDetailsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'userBioDetails',
      required: true,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'userBioDetails',
        default: [],
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'userBioDetails',
        default: [],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('userActivityDetails', userActivityDetailsSchema);
