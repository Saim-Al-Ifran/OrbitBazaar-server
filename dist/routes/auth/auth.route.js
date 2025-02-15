"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../../controllers/auth/auth.controller");
const router = express_1.default.Router();
router.post('/admin/login', auth_controller_1.adminLogin);
router.post('/users/login', auth_controller_1.userLogin);
router.post('/users/register', auth_controller_1.registerUser);
router.post('/refresh_token', auth_controller_1.refreshToken);
exports.default = router;
