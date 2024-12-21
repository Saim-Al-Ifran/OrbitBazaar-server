import User from "../../models/User";
import { IUser } from "../../types/models/User";
import CustomError from "../../utils/errors/customError";
import { uploadFileToCloudinary } from "../../utils/fileUpload";

// Service to find a user by a specific property
export const findUserByProperty = async (key: keyof IUser, value: string): Promise<IUser | null> => {
  if (key === '_id') {
    return await User.findById(value).select('-password');
  }
  return await User.findOne({ [key]: value });
};

// Service to create a new user
export const createNewUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const user = new User(userData);
  return await user.save();
};

// Service to get all users
export const getAllUsers = async (): Promise<IUser[]> => {
  return await User.find().select('-password');
};

// Service to toggle user status (block/active)
export const toggleUserStatus = async (userId: string, value: 'block' | 'active'): Promise<IUser> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new CustomError('User not found', 404);
  }
  user.status = value;
  return await user.save();
};

// Service to approve or decline vendor requests
export const approveVendor = async (userId: string, value: 'none' | 'requested' | 'approved' | 'declined'): Promise<IUser> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new CustomError('Vendor not found', 404);
  }
  user.vendorRequestStatus = value;
  return await user.save();
};

// Service to update user role
export const updateUserRole = async (userId: string, value: 'user' | 'vendor' | 'admin' | 'super-admin'): Promise<IUser> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new CustomError('User not found', 404);
  }
  user.role = value;
  return await user.save();
};

// Service to update user profile image
export const updateUserProfileImage = async (email: string, file: Express.Multer.File): Promise<IUser> => {
  const result = await uploadFileToCloudinary(file);
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError('User not found', 404);
  }
  user.image = result.secure_url;
  return await user.save();
};

// Service to change user password
export const changePassword = async (userId: string, newPassword: string): Promise<IUser> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new CustomError('User not found', 404);
  }
  const isMatched = await user.comparePassword(newPassword);
  if (isMatched) {
    throw new CustomError('New password cannot be the same as the old password', 400);
  }
  user.password = newPassword;
  return await user.save();
};

// Service to update user profile
export const updateUserProfile = async (email: string, updates: Partial<IUser>): Promise<IUser> => {
  const user = await User.findOne({ email }).select('-password');
  if (!user) {
    throw new CustomError('User not found', 404);
  }
  user.name = updates.name || user.name;
  user.phoneNumber = updates.phoneNumber || user.phoneNumber;
  user.role = 'user';  
  return await user.save();
};
