"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("./auth/auth.route"));
const user_route_1 = __importDefault(require("./user/user.route"));
const category_route_1 = __importDefault(require("./category/category.route"));
const router = (0, express_1.Router)();
router.use('/api/v1/auth', auth_route_1.default);
router.use('/api/v1', user_route_1.default);
router.use('/api/v1', category_route_1.default);
exports.default = router;
