import { Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    category: mongoose.Types.ObjectId;
    vendorEmail: string;
    price: number;
    stock: number;
    image: string;
    ratings: {
      average: number;
      count: number;
    };
    isFeatured: boolean;
    isArchived: boolean;
    salesCount: number;
    totalRevenue: number;
    analytics: {
      views: number;
      clicks: number;
    };
    createdAt?: Date;
    updatedAt?: Date;
  }