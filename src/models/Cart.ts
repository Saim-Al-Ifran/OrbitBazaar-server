import mongoose, { Schema } from "mongoose";
import { ICart } from "../types/models/Cart";


// Define the schema
const CartSchema: Schema = new Schema(
  {
    userEmail: {
        type: String,
        required: true,
        unique: true
     },
    items: [
      {
        productID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        },
      },
    ],
    totalQuantity: {
        type: Number,
        required: true,
        default: 0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
  },
  { timestamps: true }
);

// Export the model
const Cart = mongoose.model<ICart>("Cart", CartSchema);
export default Cart;
