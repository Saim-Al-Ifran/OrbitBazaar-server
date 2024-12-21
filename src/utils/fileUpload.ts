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

  const publicIdWithoutExtension = file.originalname.replace(/\.[^/.]+$/, '');

  const b64 = Buffer.from(file.buffer).toString('base64');
  const dataURI = `data:${file.mimetype};base64,${b64}`;

  return await cloudinary.uploader.upload(dataURI, {
    folder: 'horek-rokom/uploads',
    public_id: publicIdWithoutExtension,
  });
};