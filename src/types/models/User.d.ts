import { Document } from 'mongoose';

interface IRefreshToken {
    token: string;
  }
  
export interface IUser extends Document {
  name: string;
  image: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: 'user' | 'vendor' | 'admin' | 'super-admin';
  vendorRequestStatus: 'none'| 'requested' | 'approved'|  'declined';
  status: 'block' | 'active';
  refreshTokens: IRefreshToken[];
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
