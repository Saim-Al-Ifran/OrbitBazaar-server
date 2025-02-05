import  {Document} from 'mongoose';
interface IReport extends Document {
    productID: mongoose.Types.ObjectId;
    userEmail: string;
    reason: string;
    comment: string;
    status: 'pending' | 'resolve' | 'reject';
    createdAt: Date;
    updatedAt: Date;
  }