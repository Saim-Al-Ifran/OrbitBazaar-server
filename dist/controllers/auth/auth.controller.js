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
exports.logout = exports.refreshToken = exports.adminLogin = exports.userLogin = exports.registerVendor = exports.registerUser = void 0;
const TryCatch_1 = require("../../middlewares/TryCatch");
const auth_services_1 = require("../../services/auth/auth.services");
const customError_1 = __importDefault(require("../../utils/errors/customError"));
exports.registerUser = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    const newUser = yield (0, auth_services_1.registerUserService)(userData);
    res.cookie('accessToken', newUser.accessToken, { httpOnly: true, maxAge: 3600000 });
    res.cookie('refreshToken', newUser.refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            accessToken: newUser.accessToken,
            refreshToken: newUser.refreshToken,
            user: newUser.payload
        }
    });
}));
exports.registerVendor = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorData = req.body;
    const newVendor = yield (0, auth_services_1.registerVendorService)(vendorData);
    res.cookie('accessToken', newVendor.accessToken, { httpOnly: true, maxAge: 3600000 });
    res.cookie('refreshToken', newVendor.refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(201).json({
        success: true,
        message: 'Vendor registered successfully',
        data: {
            accessToken: newVendor.accessToken,
            refreshToken: newVendor.refreshToken,
            user: newVendor.payload,
        },
    });
}));
exports.userLogin = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginData = req.body;
    const { payload, accessToken, refreshToken } = yield (0, auth_services_1.loginUserService)(loginData);
    res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 3600000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: payload
        }
    });
}));
exports.adminLogin = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginData = req.body;
    const { payload, accessToken, refreshToken } = yield (0, auth_services_1.loginAdminService)(loginData);
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: false, maxAge: 3600000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: payload
        }
    });
}));
exports.refreshToken = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken: refreshTokenFromCookie } = req.cookies;
    console.log("Rrefresh token from cookie", refreshTokenFromCookie);
    if (!refreshTokenFromCookie) {
        throw new customError_1.default('Refresh token not provided', 403);
    }
    const { newPayload, accessToken, refreshToken: newRefreshToken } = yield (0, auth_services_1.refreshTokenService)(refreshTokenFromCookie);
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: false, maxAge: 3600000 });
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            accessToken: accessToken,
            refreshToken: newRefreshToken,
            user: newPayload
        }
    });
}));
exports.logout = (0, TryCatch_1.TryCatch)((_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", { httpOnly: true, secure: false });
    res.clearCookie("refreshToken", { httpOnly: true, secure: false });
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
}));
