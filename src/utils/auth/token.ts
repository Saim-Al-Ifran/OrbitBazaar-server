import jwt from 'jsonwebtoken';
import { refreshSecretKey, secretKey } from '../../secret';
 
export const generateAccessToken = (user:any): string => {
  return jwt.sign(user,secretKey, { expiresIn: '1h' });
};

export const generateRefreshToken = (user: any): string => {
  return jwt.sign(user, refreshSecretKey, { expiresIn: '7d' });
};
