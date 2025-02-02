"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../../controllers/order/order.controller");
const authenticate_1 = __importDefault(require("../../middlewares/auth/authenticate"));
const authorizeVendor_1 = __importDefault(require("../../middlewares/auth/authorizeVendor"));
const router = express_1.default.Router();
router.post('/orders', authenticate_1.default, order_controller_1.addOrder);
router.get('/orders/user', authenticate_1.default, order_controller_1.getUserOrders);
router.get('/orders/vendor', authenticate_1.default, authorizeVendor_1.default, order_controller_1.vendorOrders);
router.get('/orders/:orderId', order_controller_1.getSingleOrder);
router.patch('/orders/:orderId', authenticate_1.default, authorizeVendor_1.default, order_controller_1.changeOrderStatus);
exports.default = router;
