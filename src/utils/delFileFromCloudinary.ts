import cloudinary from '../config/cloudinary';
import { CloudinaryDeleteResponse } from '../types/types';



export const deleteFileFromCloudinary = async (cloudinaryURL: string): Promise<CloudinaryDeleteResponse> => {
  try {
    const regex = /\/v\d+\/([^\/]+\/[^\.]+)\./;
    const match = cloudinaryURL.match(regex);

    if (match && match[1]) {
      const publicId = match[1];
      const result: CloudinaryDeleteResponse = await cloudinary.uploader.destroy(publicId);
      return result;
    } else {
      console.log('Unable to extract the desired part');
      throw new Error('Invalid Cloudinary URL format');
    }
  } catch (error: any) {
    console.error('Cloudinary deletion error:', error);

    if (error.message.includes('Unexpected token < in JSON')) {
      throw new Error('Failed to delete resource from Cloudinary. Non-JSON response received.');
    } else {
      throw new Error(`Failed to delete resource from Cloudinary: ${error.message}`);
    }
  }
};