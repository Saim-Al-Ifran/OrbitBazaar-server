import { Document } from "mongoose";
interface IOrderItem {
    productID: mongoose.Schema.Types.ObjectId;
    quantity: number;
    price: number;
    total: number;
  }
  
  interface IShippingAddress {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    countryCode: string;
  }
  
  export interface IOrder extends Document {
    userEmail: string;
    items: IOrderItem[];
    totalQuantity: number;
    totalPrice: number;
    status: 'confirmed' | 'processing' | 'shipped' | 'Delivered' | 'Cancelled';
    shippingAddress: IShippingAddress;
    createdAt?: Date;
    updatedAt?: Date;
  }
  