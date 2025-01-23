import { Document } from "mongoose";
export interface IReview extends Document {
    productID: mongoose.Schema.Types.ObjectId;
    userEmail: string;
    rating: number;
    comment: string;
    createdAt?: Date;
    updatedAt?: Date;
  }