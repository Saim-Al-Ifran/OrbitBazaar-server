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
exports.updateUserProfile = exports.changePassword = exports.uploadUserProfileImage = exports.updateUserRole = exports.approveVendor = exports.toggleUserStatus = exports.getAllUsers = exports.createNewUser = exports.findUserByProperty = exports.findUserForAuth = void 0;
const User_1 = __importDefault(require("../../models/User"));
const customError_1 = __importDefault(require("../../utils/errors/customError"));
const fileUpload_1 = require("../../utils/fileUpload");
const paginate_1 = __importDefault(require("../../utils/paginate"));
//Find a user by email for authentication purposes
const findUserForAuth = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User_1.default.findOne({ email });
});
exports.findUserForAuth = findUserForAuth;
// Service to find a user by a specific property
const findUserByProperty = (key, value) => __awaiter(void 0, void 0, void 0, function* () {
    if (key === '_id') {
        return yield User_1.default.findById(value).select('-password');
    }
    return yield User_1.default.findOne({ [key]: value }).select('-password');
});
exports.findUserByProperty = findUserByProperty;
// Service to create a new user
const createNewUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new User_1.default(userData);
    return yield user.save();
});
exports.createNewUser = createNewUser;
// Service to get all users
const getAllUsers = (role, page, limit, sort, searchQuery) => __awaiter(void 0, void 0, void 0, function* () {
    const query = Object.assign(Object.assign({}, searchQuery), { role: role === "super-admin" ? { $ne: "super-admin" } : "user" });
    return yield (0, paginate_1.default)(User_1.default, query, page, limit, sort, "-password -refreshTokens");
});
exports.getAllUsers = getAllUsers;
// Service to toggle user status (block/active)
const toggleUserStatus = (userId, value, requesterRole) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.findUserByProperty)('_id', userId);
    if (!user) {
        throw new customError_1.default('User not found', 404);
    }
    if (requesterRole === 'admin' && user.role === 'admin') {
        throw new customError_1.default('Admins cannot modify the status of other admins.', 403);
    }
    user.status = value;
    return yield user.save();
});
exports.toggleUserStatus = toggleUserStatus;
// Service to approve or decline vendor requests
const approveVendor = (userId, value) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.findUserByProperty)('_id', userId);
    if (!user) {
        throw new customError_1.default('Vendor not found', 404);
    }
    user.vendorRequestStatus = value;
    return yield user.save();
});
exports.approveVendor = approveVendor;
// Service to update user role
const updateUserRole = (userId, value) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(userId);
    if (!user) {
        throw new customError_1.default('User not found', 404);
    }
    user.role = value;
    return yield user.save();
});
exports.updateUserRole = updateUserRole;
// Service to update user profile image
const uploadUserProfileImage = (email, file) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, fileUpload_1.uploadFileToCloudinary)(file);
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        throw new customError_1.default('User not found', 404);
    }
    user.image = result.secure_url;
    return yield user.save();
});
exports.uploadUserProfileImage = uploadUserProfileImage;
// Service to change user password
const changePassword = (email, currentPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.findUserForAuth)(email);
    if (!user) {
        throw new customError_1.default('User not found', 404);
    }
    const isMatched = yield user.comparePassword(currentPassword);
    if (!isMatched) {
        throw new customError_1.default("Current password doesn't match", 400);
    }
    user.password = newPassword;
    return yield user.save();
});
exports.changePassword = changePassword;
// Service to update user profile
const updateUserProfile = (email, updates) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({ email }).select('-password');
    if (!user) {
        throw new customError_1.default('User not found', 404);
    }
    user.name = updates.name || user.name;
    user.phoneNumber = updates.phoneNumber || user.phoneNumber;
    user.role = 'user';
    return yield user.save();
});
exports.updateUserProfile = updateUserProfile;
