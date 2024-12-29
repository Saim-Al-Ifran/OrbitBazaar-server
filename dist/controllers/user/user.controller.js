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
exports.changePasswordHandler = exports.updateUserProfileHandler = exports.updateUserProfileImage = exports.getUserProfile = exports.updateVendorRequestStatus = exports.updateUserStatus = exports.createUser = exports.findAllUsers = void 0;
const TryCatch_1 = require("../../middlewares/TryCatch");
const user_services_1 = require("../../services/user/user.services");
const customError_1 = __importDefault(require("../../utils/errors/customError"));
exports.findAllUsers = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
    if (role !== "super-admin" && role !== "admin") {
        throw new customError_1.default("Unauthorized role for fetching users", 403);
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || { createdAt: -1 };
    const search = req.query.search;
    const searchQuery = search
        ? {
            $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { role: { $regex: search, $options: "i" } },
            ],
        }
        : {};
    const { data, totalRecords, totalPages, prevPage, nextPage } = yield (0, user_services_1.getAllUsers)(role, page, limit, sort, searchQuery);
    res.status(200).json({
        success: true,
        message: "Users fetched successfully.",
        data,
        pagination: {
            totalRecords,
            totalPages,
            prevPage,
            nextPage,
            currentPage: page
        }
    });
}));
exports.createUser = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let { name, email, password, role, phoneNumber } = req.body;
    const requesterRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
    role = requesterRole === 'admin' ? 'user' : role;
    const userData = {
        name,
        email,
        password,
        role,
        phoneNumber,
    };
    const newUser = yield (0, user_services_1.createNewUser)(userData);
    res.status(201).json({
        success: true,
        message: 'User created successfully.',
        data: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            phoneNumber: newUser.phoneNumber,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
        },
    });
}));
exports.updateUserStatus = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const requesterRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
    if (requesterRole !== "super-admin" && requesterRole !== "admin") {
        throw new customError_1.default("Unauthorized role for fetching users", 403);
    }
    const { id } = req.params;
    const { status } = req.body;
    const updatedUser = yield (0, user_services_1.toggleUserStatus)(id, status, requesterRole);
    res.status(200).json({
        success: true,
        message: `User status updated to ${status} successfully.`,
        data: {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            status: updatedUser.status,
            updatedAt: updatedUser.updatedAt,
        },
    });
}));
exports.updateVendorRequestStatus = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { status } = req.body;
    const updatedUser = yield (0, user_services_1.approveVendor)(userId, status);
    res.status(200).json({
        success: true,
        message: `Vendor status updated successfully to '${status}'.`,
        data: {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            vendorRequestStatus: updatedUser.vendorRequestStatus,
            updatedAt: updatedUser.updatedAt,
        },
    });
}));
exports.getUserProfile = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!email) {
        throw new customError_1.default('User ID is missing', 400);
    }
    const user = yield (0, user_services_1.findUserByProperty)('email', email);
    res.status(200).json({
        success: true,
        message: 'User profile retrieved successfully.',
        data: user,
    });
}));
exports.updateUserProfileImage = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!email) {
        throw new customError_1.default('Unauthorized request.', 401);
    }
    if (!req.file) {
        throw new customError_1.default('Profile image is required.', 400);
    }
    const updatedUser = yield (0, user_services_1.uploadUserProfileImage)(email, req.file);
    res.status(200).json({
        success: true,
        message: 'Profile image uploaded successfully.',
        data: {
            image: updatedUser.image
        },
    });
}));
exports.updateUserProfileHandler = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!email) {
        throw new customError_1.default('Email is required', 400);
    }
    const updates = req.body;
    console.log(updates);
    const updatedUser = yield (0, user_services_1.updateUserProfile)(email, updates);
    res.status(200).json({
        message: 'Profile updated successfully',
        data: {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            image: updatedUser.image,
            role: updatedUser.role,
        },
    });
}));
exports.changePasswordHandler = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    const { currentPassword, newPassword } = req.body;
    if (!newPassword) {
        throw new customError_1.default('New password is required', 400);
    }
    if (!email) {
        throw new customError_1.default('Email is required', 400);
    }
    const updatedUser = yield (0, user_services_1.changePassword)(email, currentPassword, newPassword);
    res.status(200).json({
        message: 'Password updated successfully',
        user: {
            id: updatedUser._id,
            email: updatedUser.email,
            name: updatedUser.name,
        },
    });
}));
