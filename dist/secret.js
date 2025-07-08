"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseClientCertUrl = exports.firebaseAuthProviderCertUrl = exports.firebaseTokenUri = exports.firebaseAuthUri = exports.firebaseClientId = exports.firebaseClientEmail = exports.firebasePrivateKey = exports.firebasePrivateKeyId = exports.firebaseProjectId = exports.firebaseType = exports.stripeSecretKey = exports.cloudinarySecretKey = exports.cloudinaryApiKey = exports.cloudinaryCloudName = exports.refreshSecretKey = exports.secretKey = exports.nodeEnv = exports.mongoDbUrl = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { MONGODB_URL, NODE_ENV, JWT_SECRET_KEY, JWT_REFRESH_TOKEN_KEY, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET_KEY, STRIPE_SECRET_KEY, FIREBASE_TYPE, FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, FIREBASE_CLIENT_ID, FIREBASE_AUTH_URI, FIREBASE_TOKEN_URI, FIREBASE_AUTH_PROVIDER_CERT_URL, FIREBASE_CLIENT_CERT_URL, } = process.env;
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
if (!JWT_REFRESH_TOKEN_KEY) {
    throw new Error('Missing CLOUDINARY_API_SECRET_KEY environment variable');
}
if (!STRIPE_SECRET_KEY) {
    throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}
if (!FIREBASE_TYPE) {
    throw new Error('Missing FIREBASE_TYPE environment variable');
}
if (!FIREBASE_PROJECT_ID) {
    throw new Error('Missing FIREBASE_PROJECT_ID environment variable');
}
if (!FIREBASE_PRIVATE_KEY_ID) {
    throw new Error('Missing FIREBASE_PRIVATE_KEY_ID environment variable');
}
if (!FIREBASE_PRIVATE_KEY) {
    throw new Error('Missing FIREBASE_PRIVATE_KEY environment variable');
}
if (!FIREBASE_CLIENT_EMAIL) {
    throw new Error('Missing FIREBASE_CLIENT_EMAIL environment variable');
}
if (!FIREBASE_CLIENT_ID) {
    throw new Error('Missing FIREBASE_CLIENT_ID environment variable');
}
if (!FIREBASE_AUTH_URI) {
    throw new Error('Missing FIREBASE_AUTH_URI environment variable');
}
if (!FIREBASE_TOKEN_URI) {
    throw new Error('Missing FIREBASE_TOKEN_URI environment variable');
}
if (!FIREBASE_AUTH_PROVIDER_CERT_URL) {
    throw new Error('Missing FIREBASE_AUTH_PROVIDER_CERT_URL environment variable');
}
if (!FIREBASE_CLIENT_CERT_URL) {
    throw new Error('Missing FIREBASE_CLIENT_CERT_URL environment variable');
}
exports.mongoDbUrl = MONGODB_URL;
exports.nodeEnv = NODE_ENV;
exports.secretKey = JWT_SECRET_KEY;
exports.refreshSecretKey = JWT_REFRESH_TOKEN_KEY;
exports.cloudinaryCloudName = CLOUDINARY_CLOUD_NAME;
exports.cloudinaryApiKey = CLOUDINARY_API_KEY;
exports.cloudinarySecretKey = CLOUDINARY_API_SECRET_KEY;
exports.stripeSecretKey = STRIPE_SECRET_KEY;
exports.firebaseType = FIREBASE_TYPE;
exports.firebaseProjectId = FIREBASE_PROJECT_ID;
exports.firebasePrivateKeyId = FIREBASE_PRIVATE_KEY_ID;
exports.firebasePrivateKey = FIREBASE_PRIVATE_KEY;
exports.firebaseClientEmail = FIREBASE_CLIENT_EMAIL;
exports.firebaseClientId = FIREBASE_CLIENT_ID;
exports.firebaseAuthUri = FIREBASE_AUTH_URI;
exports.firebaseTokenUri = FIREBASE_TOKEN_URI;
exports.firebaseAuthProviderCertUrl = FIREBASE_AUTH_PROVIDER_CERT_URL;
exports.firebaseClientCertUrl = FIREBASE_CLIENT_CERT_URL;
