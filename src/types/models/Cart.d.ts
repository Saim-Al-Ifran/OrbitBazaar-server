import  { Document } from "mongoose";
// Define the interface for the cart item
interface ICartItem {
    productID: mongoose.Schema.Types.ObjectId;
    quantity: number;
    price: number;
    total: number;
  }
  
  // Define the interface for the cart
  export interface ICart extends Document {
    userEmail: string;
    items: ICartItem[];
    totalQuantity: number;
    totalPrice: number;
    timestamps: Date;
  }