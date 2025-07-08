import mongoose, { Schema  } from 'mongoose';
import { IOrder } from '../types/models/Order';


const OrderSchema: Schema = new Schema(
  {
    userEmail: {
        type: String,
        required: true
    },
    items: [
      {
        productID: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
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
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
      type: String,
      enum: ['confirmed', 'processing', 'delivered', 'cancelled'],
      default: 'confirmed',
    },
    shippingAddress: {
      fullName: {
        type: String,
        required: true
      },
      phoneNumber:{
        type:String,
        required:true
      },
      address: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      postalCode: {
        type: String,
        required: true
      },
      countryCode: {
        type: String,
        required: true
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', OrderSchema);
