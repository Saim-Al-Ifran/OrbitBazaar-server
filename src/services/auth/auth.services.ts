import jwt from 'jsonwebtoken';
import { IUser } from "../../types/models/User";
import { generateAccessToken, generateRefreshToken } from "../../utils/auth/token";
import CustomError from "../../utils/errors/customError";
import { createNewUser, findUserByProperty, findUserForAuth } from "../user/user.services";
import { refreshSecretKey } from '../../secret';

 
export const registerUserService = async (
  userData: Partial<IUser>
): Promise<{ payload: object; accessToken: string; refreshToken: string }> => {
  const { name, phoneNumber, email, password } = userData;

  if (!name || !phoneNumber || !email || !password) {
    throw new CustomError("All fields (name, phoneNumber, email, password) are required", 400);
  }

  let user = await findUserForAuth(email);

  if (user) {
    if (user.isDeleted) {
      user.name = name;
      user.phoneNumber = phoneNumber;
      user.isDeleted = false;
      user.password = password; 
    } else {
      throw new CustomError("User already exists with this email", 400);
    }
  } else {
    user = await createNewUser({ name, phoneNumber, email, password });
  }

  const payload = {
    id: user._id,
    username: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Store the refresh token
  user.refreshTokens.push({ token: refreshToken });
  await user.save();

  return { payload, accessToken, refreshToken };
};


 export const loginUserService = async (loginData: { email: string; password: string }): Promise<{payload:object; accessToken: string; refreshToken: string }> => {
    const { email, password } = loginData;
  
    const user = await findUserForAuth(email);
    if (!user || user.isDeleted) {
      throw new CustomError('Invalid email or password', 401);
    }
    if(user.role === 'admin' || user.role=== 'super-admin'){
      throw new CustomError('Only users are allowed to login.', 403);
    }
  
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new CustomError('Invalid email or password', 401);
    }
  
    const payload  = {
      id: user._id,
      username: user.name,
      email: user.email,
      role: user.role
    };
  
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    user.refreshTokens.push({ token: refreshToken });
    await user.save();
    
    return {payload,accessToken, refreshToken };
  };

 export const loginAdminService = async (loginData: { email: string; password: string }): Promise<{payload: object; accessToken: string; refreshToken: string }> => {
    const { email, password } = loginData;
    const user = await findUserForAuth(email);
  
    if (!user || user.role == 'user') {
      throw new CustomError('Only admins are allowed to login', 401);
    }
    
    const isMatch =  user.comparePassword(password);
    if (!isMatch) {
      throw new CustomError('Invalid email or password', 401);
    }
    const payload  = {
      id: user._id,
      username: user.name,
      email: user.email,
      role: user.role
    };
  
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    user.refreshTokens.push({ token: refreshToken });
    await user.save();
  
    return {payload,accessToken, refreshToken };
  };

  export const refreshTokenService = async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    if (!refreshToken) {
      throw new CustomError('Refresh token not provided', 400);
    }
  
    let payload: any;
    try {
      payload = jwt.verify(refreshToken, refreshSecretKey);
    } catch (error) {
      console.error('JWT verification failed:', error);
      throw new CustomError('Invalid refresh token', 403);
    }
  
    const user = await findUserByProperty('_id', payload.id);
    if (!user || !user.refreshTokens.some((rt) => rt.token === refreshToken)) {
      throw new CustomError('Invalid refresh token', 403);
    }
  
    const newAccessToken = generateAccessToken({
      id: user._id,
      username: user.name,
      email: user.email,
      role: user.role,
    });
    const newRefreshToken = generateRefreshToken({ id: user._id });
  
    user.refreshTokens = user.refreshTokens.filter((rt) => rt.token !== refreshToken);
    user.refreshTokens.push({ token: newRefreshToken });
    await user.save();
  
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  };
  
 
  