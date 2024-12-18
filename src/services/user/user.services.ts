import User from "../../models/User";
import { IUser } from "../../types/models/User";
import CustomError from "../../utils/errors/customError";

export const findUserByProperty = async (key: keyof IUser, value: string): Promise<IUser | null> => {
    try {
      if (key === '_id') {
        return await User.findById(value).select('-password');
      }
      return await User.findOne({ [key]: value });
    } catch (error) {
      throw new CustomError(`Error finding user by ${key}`, 500);
    }
  };

export const createNewUser = async (userData: Partial<IUser>): Promise<IUser> => {
    try {
       
          
          const user = new User(userData);
          return await user.save();
    } catch (error : any) {
          
          throw new CustomError(error.message, 500);
    }
};
