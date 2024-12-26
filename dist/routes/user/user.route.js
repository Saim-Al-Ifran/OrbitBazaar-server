"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = __importDefault(require("../../middlewares/auth/authenticate"));
const authorizeAdmin_1 = __importDefault(require("../../middlewares/auth/authorizeAdmin"));
const user_controller_1 = require("../../controllers/user/user.controller");
const router = express_1.default.Router();
router.get('/admin/users', authenticate_1.default, authorizeAdmin_1.default, user_controller_1.findAllUsers);
router.post('/admin/users', authenticate_1.default, authorizeAdmin_1.default, user_controller_1.createUser);
router.patch('/admin/users/:id/status', authenticate_1.default, authorizeAdmin_1.default, user_controller_1.updateUserStatus);
router.patch('/admin/vendors/:userId/status', authenticate_1.default, authorizeAdmin_1.default, user_controller_1.updateVendorRequestStatus);
exports.default = router;
