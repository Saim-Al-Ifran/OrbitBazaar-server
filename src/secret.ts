import dotenv from 'dotenv';
dotenv.config();

const {
  MONGODB_URL,
  NODE_ENV,
  JWT_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET_KEY
} = process.env;

if (!MONGODB_URL) {
  throw new Error('Missing MONGODB_URL environment variable');
}
if (!NODE_ENV) {
  throw new Error('Missing NODE_ENV environment variable');
}
if (!JWT_SECRET_KEY) {
  throw new Error('Missing JWT_SECRET_KEY environment variable');
}
// if (!CLOUDINARY_CLOUD_NAME) {
//   throw new Error('Missing CLOUDINARY_CLOUD_NAME environment variable');
// }
// if (!CLOUDINARY_API_KEY) {
//   throw new Error('Missing CLOUDINARY_API_KEY environment variable');
// }
// if (!CLOUDINARY_API_SECRET_KEY) {
//   throw new Error('Missing CLOUDINARY_API_SECRET_KEY environment variable');
// }
// if(!JWT_REFRESH_SECRET_KEY){
//   throw new Error('Missing CLOUDINARY_API_SECRET_KEY environment variable');
// }

export const mongoDbUrl = MONGODB_URL;
export const nodeEnv = NODE_ENV;
export const secretKey = JWT_SECRET_KEY;
export const refreshSecretKey = JWT_SECRET_KEY;
export const cloudinaryCloudName = CLOUDINARY_CLOUD_NAME;
export const cloudinaryApiKey = CLOUDINARY_API_KEY;
export const cloudinarySecretKey = CLOUDINARY_API_SECRET_KEY;
