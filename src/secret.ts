import dotenv from 'dotenv';
dotenv.config();

const {
  MONGODB_URL,
  NODE_ENV,
  JWT_SECRET_KEY,
  JWT_REFRESH_TOKEN_KEY,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET_KEY,
  STRIPE_SECRET_KEY,
  FIREBASE_TYPE,
  FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY_ID,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_CLIENT_ID,
  FIREBASE_AUTH_URI,
  FIREBASE_TOKEN_URI,
  FIREBASE_AUTH_PROVIDER_CERT_URL,
  FIREBASE_CLIENT_CERT_URL,

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
if (!CLOUDINARY_CLOUD_NAME) {
  throw new Error('Missing CLOUDINARY_CLOUD_NAME environment variable');
}
if (!CLOUDINARY_API_KEY) {
  throw new Error('Missing CLOUDINARY_API_KEY environment variable');
}
if (!CLOUDINARY_API_SECRET_KEY) {
  throw new Error('Missing CLOUDINARY_API_SECRET_KEY environment variable');
}
if(!JWT_REFRESH_TOKEN_KEY){
  throw new Error('Missing CLOUDINARY_API_SECRET_KEY environment variable');
}
if(!STRIPE_SECRET_KEY){
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}
if(!FIREBASE_TYPE){
  throw new Error('Missing FIREBASE_TYPE environment variable');
}
if(!FIREBASE_PROJECT_ID){
  throw new Error('Missing FIREBASE_PROJECT_ID environment variable');
}
if(!FIREBASE_PRIVATE_KEY_ID){
  throw new Error('Missing FIREBASE_PRIVATE_KEY_ID environment variable');
}
if(!FIREBASE_PRIVATE_KEY){
  throw new Error('Missing FIREBASE_PRIVATE_KEY environment variable');
}
if(!FIREBASE_CLIENT_EMAIL){
  throw new Error('Missing FIREBASE_CLIENT_EMAIL environment variable');
}
if(!FIREBASE_CLIENT_ID){
  throw new Error('Missing FIREBASE_CLIENT_ID environment variable');
}
if(!FIREBASE_AUTH_URI){
  throw new Error('Missing FIREBASE_AUTH_URI environment variable');
}
if(!FIREBASE_TOKEN_URI){
  throw new Error('Missing FIREBASE_TOKEN_URI environment variable');
}
if(!FIREBASE_AUTH_PROVIDER_CERT_URL){
  throw new Error('Missing FIREBASE_AUTH_PROVIDER_CERT_URL environment variable');
}
if(!FIREBASE_CLIENT_CERT_URL){
  throw new Error('Missing FIREBASE_CLIENT_CERT_URL environment variable');
}

export const mongoDbUrl = MONGODB_URL;
export const nodeEnv = NODE_ENV;
export const secretKey = JWT_SECRET_KEY;
export const refreshSecretKey =  JWT_REFRESH_TOKEN_KEY;
export const cloudinaryCloudName = CLOUDINARY_CLOUD_NAME;
export const cloudinaryApiKey = CLOUDINARY_API_KEY;
export const cloudinarySecretKey = CLOUDINARY_API_SECRET_KEY;
export const stripeSecretKey = STRIPE_SECRET_KEY;
export const firebaseType = FIREBASE_TYPE;
export const firebaseProjectId = FIREBASE_PROJECT_ID;
export const firebasePrivateKeyId = FIREBASE_PRIVATE_KEY_ID;
export const firebasePrivateKey = FIREBASE_PRIVATE_KEY;
export const firebaseClientEmail = FIREBASE_CLIENT_EMAIL ; 
export const firebaseClientId = FIREBASE_CLIENT_ID;
export const firebaseAuthUri = FIREBASE_AUTH_URI;
export const firebaseTokenUri = FIREBASE_TOKEN_URI;
export const firebaseAuthProviderCertUrl = FIREBASE_AUTH_PROVIDER_CERT_URL ;
export const firebaseClientCertUrl = FIREBASE_CLIENT_CERT_URL  ;
 
