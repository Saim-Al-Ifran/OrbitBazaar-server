"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret_1 = require("../../secret");
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign(user, secret_1.secretKey, { expiresIn: '1h' });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign(user, secret_1.refreshSecretKey, { expiresIn: '7d' });
};
exports.generateRefreshToken = generateRefreshToken;
