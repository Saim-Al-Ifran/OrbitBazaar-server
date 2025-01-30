import mongoose, { Schema } from "mongoose";
import { IWishlist } from "../types/models/Wishlist";

 
const WishlistSchema = new Schema<IWishlist>(
  {
    userEmail: { type: String, required: true, unique: true },
    items: [
      {
        productID: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Wishlist = mongoose.model<IWishlist>("Wishlist", WishlistSchema);
export default Wishlist;
