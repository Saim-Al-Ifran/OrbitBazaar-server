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
exports.vendorOrders = exports.changeOrderStatus = exports.getUserSingleOrder = exports.getUserOrders = exports.addOrder = void 0;
const TryCatch_1 = require("../../middlewares/TryCatch");
const order_services_1 = require("../../services/order/order.services");
const customError_1 = __importDefault(require("../../utils/errors/customError"));
const cache_1 = require("../../utils/cache");
exports.addOrder = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!userEmail) {
        throw new customError_1.default("user not found", 404);
    }
    const order = yield (0, order_services_1.createOrder)(Object.assign({ userEmail }, req.body));
    res.status(201).json({ message: 'Order placed successfully', orderId: order.id });
}));
exports.getUserOrders = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!userEmail) {
        throw new customError_1.default("user not found", 404);
    }
    const cachedKey = `orders_${userEmail}`;
    const cachedOrders = yield (0, cache_1.getCache)(cachedKey);
    if (cachedOrders) {
        return res.json(JSON.parse(cachedOrders));
    }
    const orders = yield (0, order_services_1.findOrdersByUserEmail)(userEmail);
    yield (0, cache_1.setCache)(cachedKey, orders, 60);
    res.json(orders);
}));
exports.getUserSingleOrder = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { orderId } = req.params;
    const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!userEmail) {
        throw new customError_1.default("user not found", 404);
    }
    const order = yield (0, order_services_1.findOrderById)(orderId, userEmail);
    if (!order) {
        throw new customError_1.default("Order not found", 404);
    }
    res.json({ message: 'Order retrieve successfully', order });
}));
// Update order status (Only vendor can update)
exports.changeOrderStatus = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { orderId } = req.params;
    const { status } = req.body;
    const vendorEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!vendorEmail) {
        throw new customError_1.default("user not found", 404);
    }
    const updatedOrder = yield (0, order_services_1.updateOrderStatus)(orderId, vendorEmail, status);
    if (!updatedOrder) {
        throw new customError_1.default("Not authorized to update this order", 403);
    }
    res.json(updatedOrder);
}));
// Get vendor orders
exports.vendorOrders = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const vendorEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!vendorEmail) {
        throw new customError_1.default("user not found", 404);
    }
    const orders = yield (0, order_services_1.getVendorOrders)(vendorEmail);
    res.json(orders);
}));
