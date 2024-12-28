"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileFromCloudinary = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const deleteFileFromCloudinary = (cloudinaryURL) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const regex = /\/v\d+\/([^\/]+\/[^\.]+)\./;
        const match = cloudinaryURL.match(regex);
        if (match && match[1]) {
            const publicId = match[1];
            const result = yield cloudinary_1.default.uploader.destroy(publicId);
            return result;
        }
        else {
            console.log('Unable to extract the desired part');
            throw new Error('Invalid Cloudinary URL format');
        }
    }
    catch (error) {
        console.error('Cloudinary deletion error:', error);
        if (error.message.includes('Unexpected token < in JSON')) {
            throw new Error('Failed to delete resource from Cloudinary. Non-JSON response received.');
        }
        else {
            throw new Error(`Failed to delete resource from Cloudinary: ${error.message}`);
        }
    }
});
exports.deleteFileFromCloudinary = deleteFileFromCloudinary;
