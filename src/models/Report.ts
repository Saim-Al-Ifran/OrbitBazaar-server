import mongoose, { Schema } from 'mongoose';
import { IReport } from '../types/models/Report';
 
const ReportSchema = new Schema<IReport>(
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
    reason: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'resolve', 'reject'],
        default: 'pending'
    },
  },
  { timestamps: true }
);

 
const Report = mongoose.model<IReport>('Report', ReportSchema);
export default Report;
