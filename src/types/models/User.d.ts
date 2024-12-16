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
  status: 'block' | 'pending' | 'approved' | 'decline' | 'active';
  refreshTokens: IRefreshToken[];
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
