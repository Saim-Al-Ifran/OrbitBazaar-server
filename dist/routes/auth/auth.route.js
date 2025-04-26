"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../../controllers/auth/auth.controller");
const authenticate_1 = __importDefault(require("../../middlewares/auth/authenticate"));
const router = express_1.default.Router();
router.post('/admin/login', auth_controller_1.adminLogin);
router.post('/users/login', auth_controller_1.userLogin);
router.post('/users/register', auth_controller_1.registerUser);
router.post('/vendors/register', auth_controller_1.registerVendor);
router.post('/refresh_token', auth_controller_1.refreshToken);
router.post('/logout', auth_controller_1.logout);
router.post('/firebase_login', auth_controller_1.firebaseLoginController);
router.put('/reset_password', authenticate_1.default, auth_controller_1.resetPassword);
exports.default = router;
