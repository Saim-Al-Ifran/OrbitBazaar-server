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
exports.refreshTokenService = exports.loginAdminService = exports.loginUserService = exports.registerUserService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_1 = require("../../utils/auth/token");
const customError_1 = __importDefault(require("../../utils/errors/customError"));
const user_services_1 = require("../user/user.services");
const secret_1 = require("../../secret");
const registerUserService = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, phoneNumber, email, password } = userData;
    if (!email) {
        throw new customError_1.default('Email is required', 400);
    }
    const existingUser = yield (0, user_services_1.findUserByProperty)('email', email);
    if (existingUser) {
        throw new customError_1.default('User already exists with this email', 400);
    }
    const newUser = yield (0, user_services_1.createNewUser)({ name, phoneNumber, email, password });
    const payload = {
        id: newUser._id,
        username: newUser.name,
        email: newUser.email,
        role: newUser.role
    };
    const accessToken = (0, token_1.generateAccessToken)(payload);
    const refreshToken = (0, token_1.generateRefreshToken)(payload);
    newUser.refreshTokens.push({ token: refreshToken });
    yield newUser.save();
    return { payload, accessToken, refreshToken };
});
exports.registerUserService = registerUserService;
const loginUserService = (loginData) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = loginData;
    if (!email) {
        throw new customError_1.default('Email is required', 400);
    }
    if (!password) {
        throw new customError_1.default('Password is required', 400);
    }
    const user = yield (0, user_services_1.findUserByProperty)('email', email);
    if (!user) {
        throw new customError_1.default('Invalid email or password', 401);
    }
    const isMatch = yield user.comparePassword(password);
    if (!isMatch) {
        throw new customError_1.default('Invalid email or password', 401);
    }
    const payload = {
        id: user._id,
        username: user.name,
        email: user.email,
        role: user.role
    };
    const accessToken = (0, token_1.generateAccessToken)(payload);
    const refreshToken = (0, token_1.generateRefreshToken)(payload);
    return { payload, accessToken, refreshToken };
});
exports.loginUserService = loginUserService;
const loginAdminService = (loginData) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = loginData;
    const user = yield (0, user_services_1.findUserByProperty)('email', email);
    if (!user || user.role == 'user') {
        throw new customError_1.default('Only admins are allowed to login', 401);
    }
    const isMatch = user.comparePassword(password);
    if (!isMatch) {
        throw new customError_1.default('Invalid email or password', 401);
    }
    const payload = {
        id: user._id,
        username: user.name,
        email: user.email,
        role: user.role
    };
    const accessToken = (0, token_1.generateAccessToken)(payload);
    const refreshToken = (0, token_1.generateRefreshToken)(payload);
    user.refreshTokens.push({ token: refreshToken });
    yield user.save();
    return { payload, accessToken, refreshToken };
});
exports.loginAdminService = loginAdminService;
const refreshTokenService = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (!refreshToken) {
        throw new customError_1.default('Refresh token not provided', 400);
    }
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(refreshToken, secret_1.refreshSecretKey);
    }
    catch (error) {
        throw new customError_1.default('Invalid refresh token', 403);
    }
    console.log(payload.id);
    const user = yield (0, user_services_1.findUserByProperty)('_id', payload.id);
    if (!user || !user.refreshTokens.some((rt) => rt.token === refreshToken)) {
        throw new customError_1.default('Invalid refresh token', 403);
    }
    const newAccessToken = (0, token_1.generateAccessToken)({
        id: user._id,
        username: user.name,
        email: user.email,
        role: user.role
    });
    const newRefreshToken = (0, token_1.generateRefreshToken)({ id: user._id });
    user.refreshTokens = user.refreshTokens.filter((rt) => rt.token !== refreshToken);
    user.refreshTokens.push({ token: newRefreshToken });
    yield user.save();
    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };
});
exports.refreshTokenService = refreshTokenService;
