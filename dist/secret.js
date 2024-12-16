"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinarySecretKey = exports.cloudinaryApiKey = exports.cloudinaryCloudName = exports.refreshSecretKey = exports.secretKey = exports.nodeEnv = exports.mongoDbUrl = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { MONGODB_URL, NODE_ENV, JWT_SECRET_KEY, JWT_REFRESH_SECRET_KEY, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET_KEY } = process.env;
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
exports.mongoDbUrl = MONGODB_URL;
exports.nodeEnv = NODE_ENV;
exports.secretKey = JWT_SECRET_KEY;
exports.refreshSecretKey = JWT_SECRET_KEY;
exports.cloudinaryCloudName = CLOUDINARY_CLOUD_NAME;
exports.cloudinaryApiKey = CLOUDINARY_API_KEY;
exports.cloudinarySecretKey = CLOUDINARY_API_SECRET_KEY;
