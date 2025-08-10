import cloudinary  from '../config/cloudinary';
import { Buffer } from 'buffer';
import { UploadApiResponse } from 'cloudinary';

interface UploadedFile {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

export const uploadFileToCloudinary = async (file: UploadedFile): Promise<UploadApiResponse> => {
  if (!file) {
    const error = new Error('No file uploaded');
    (error as any).statusCode = 403; // TypeScript does not have a statusCode property on Error
    throw error;
  }

  // Generate a unique public ID for the file
  const publicIdWithoutExtension = `${file.originalname.replace(/\.[^/.]+$/, '')}_${Date.now()}`;

  const b64 = Buffer.from(file.buffer).toString('base64');
  const dataURI = `data:${file.mimetype};base64,${b64}`;

   const result = await cloudinary.uploader.upload(dataURI, {
    folder: 'obritBazaar/uploads',
    public_id: publicIdWithoutExtension,
  });
  return result;
};