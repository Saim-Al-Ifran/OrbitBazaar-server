import mongoose, { Schema, Document } from 'mongoose';
import { IReview } from '../types/models/Review';



const ReviewSchema: Schema = new Schema(
  {
    productID: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
         type: String,
         required: true
    },
  },
  { timestamps: true }
);

export default mongoose.model<IReview>('Review', ReviewSchema);
