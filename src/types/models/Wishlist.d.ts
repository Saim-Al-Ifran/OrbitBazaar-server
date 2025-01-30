import  {  Document } from "mongoose";

interface WishlistItem {
  productID: mongoose.Types.ObjectId;
  addedAt: Date;
}

export interface IWishlist extends Document {
  userEmail: string;
  items: WishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}