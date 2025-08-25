"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = __importDefault(require("../../middlewares/auth/authenticate"));
const authorizeAdmin_1 = __importDefault(require("../../middlewares/auth/authorizeAdmin"));
const authorizeVendor_1 = __importDefault(require("../../middlewares/auth/authorizeVendor"));
const dashboard_controller_1 = require("../../controllers/dashboard/dashboard.controller");
const router = express_1.default.Router();
router.get('/admin/dashboard/stats', authenticate_1.default, authorizeAdmin_1.default, dashboard_controller_1.getDashboardStats);
router.get('/vendor/dashboard/stats', authenticate_1.default, authorizeVendor_1.default, dashboard_controller_1.getVendorDashboardStats);
router.get('/user/dashboard/stats', authenticate_1.default, dashboard_controller_1.getUserDashboardStats);
exports.default = router;
