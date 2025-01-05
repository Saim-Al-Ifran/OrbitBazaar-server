"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../../controllers/product/product.controller");
const authorizeVendor_1 = __importDefault(require("../../middlewares/auth/authorizeVendor"));
const uploadFile_1 = __importDefault(require("../../middlewares/uploadFile/uploadFile"));
const authenticate_1 = __importDefault(require("../../middlewares/auth/authenticate"));
const router = express_1.default.Router();
router.get('/products', product_controller_1.getAllProducts);
router.post('/products', authenticate_1.default, authorizeVendor_1.default, uploadFile_1.default.single('image'), product_controller_1.createProduct);
exports.default = router;
