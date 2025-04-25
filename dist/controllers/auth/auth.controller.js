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
exports.logout = exports.resetPassword = exports.firebaseLoginController = exports.refreshToken = exports.adminLogin = exports.userLogin = exports.registerVendor = exports.registerUser = void 0;
const TryCatch_1 = require("../../middlewares/TryCatch");
const auth_services_1 = require("../../services/auth/auth.services");
const customError_1 = __importDefault(require("../../utils/errors/customError"));
const firebase_1 = require("../../firebase/firebase");
const user_services_1 = require("../../services/user/user.services");
const token_1 = require("../../utils/auth/token");
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
exports.firebaseLoginController = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { idToken } = req.body;
    if (!idToken)
        throw new customError_1.default('No ID token provided', 400);
    const decodedToken = yield firebase_1.firebaseAdmin.auth().verifyIdToken(idToken);
    const { uid, email, name, phoneNumber, picture } = decodedToken;
    if (!email) {
        throw new customError_1.default('Email is missing', 400);
    }
    let user = yield (0, user_services_1.findUserByProperty)('email', email);
    if (!user) {
        user = yield (0, user_services_1.createNewUser)({
            name: name || 'Anonymous',
            phoneNumber: phoneNumber || 'N/A',
            email,
            firebaseUID: uid,
            image: picture || 'N/A',
        });
    }
    const payload = {
        id: user._id,
        email: user.email,
        username: user.name,
        role: user.role,
    };
    const accessToken = (0, token_1.generateAccessToken)(payload);
    const refreshToken = (0, token_1.generateRefreshToken)(payload);
    user.refreshTokens.push({ token: refreshToken });
    yield user.save();
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
exports.resetPassword = (0, TryCatch_1.TryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    const { oldPassword, newPassword } = req.body;
    console.log(email);
    if (!email || !oldPassword || !newPassword) {
        throw new customError_1.default('Email, old password, and new password are required.', 400);
    }
    yield (0, auth_services_1.changePasswordService)(email, oldPassword, newPassword);
    res.status(200).json({ success: true, message: 'Password changed successfully.' });
}));
exports.logout = (0, TryCatch_1.TryCatch)((_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", { httpOnly: true, secure: false });
    res.clearCookie("refreshToken", { httpOnly: true, secure: false });
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
}));
