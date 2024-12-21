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
exports.uploadFileToCloudinary = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const buffer_1 = require("buffer");
const uploadFileToCloudinary = (file) => __awaiter(void 0, void 0, void 0, function* () {
    if (!file) {
        const error = new Error('No file uploaded');
        error.statusCode = 403; // TypeScript does not have a statusCode property on Error
        throw error;
    }
    const publicIdWithoutExtension = file.originalname.replace(/\.[^/.]+$/, '');
    const b64 = buffer_1.Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;
    return yield cloudinary_1.default.uploader.upload(dataURI, {
        folder: 'horek-rokom/uploads',
        public_id: publicIdWithoutExtension,
    });
});
exports.uploadFileToCloudinary = uploadFileToCloudinary;
