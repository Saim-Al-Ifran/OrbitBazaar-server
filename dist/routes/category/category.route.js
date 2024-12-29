"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = __importDefault(require("../../middlewares/auth/authenticate"));
const authorizeAdmin_1 = __importDefault(require("../../middlewares/auth/authorizeAdmin"));
const category_controller_1 = require("../../controllers/category/category.controller");
const router = express_1.default.Router();
router.get('/categories', category_controller_1.findAllCategories);
router.get('/admin/categories', authenticate_1.default, authorizeAdmin_1.default, category_controller_1.findAllCategoriesForAdmin);
exports.default = router;
