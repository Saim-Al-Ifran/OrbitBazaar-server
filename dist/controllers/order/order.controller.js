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
    const cachedKey = `orders_${userEmail}`;
    const order = yield (0, order_services_1.createOrder)(Object.assign({ userEmail }, req.body));
    yield (0, cache_1.deleteCache)(cachedKey);
    yield (0, cache_1.deleteCacheByPattern)("orders_*");
    res.status(201).json({ message: 'Order placed successfully', orderId: order.id });
}));
exports.getUserOrders = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!userEmail) {
        throw new customError_1.default("User not found", 404);
    }
    // Extract pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    // Extract sort and split
    const sortQuery = req.query.sort || "createdAt:desc";
    const [field, order] = sortQuery.split(":");
    const sortOption = {
        [field]: order === "asc" ? 1 : -1,
    };
    // Generate a safe cache key
    const cacheKey = `orders_${userEmail}_page${page}_limit${limit}_sort_${field}_${order}`;
    const cachedOrders = yield (0, cache_1.getCache)(cacheKey);
    if (cachedOrders) {
        return res.json(JSON.parse(cachedOrders));
    }
    // Use proper paginated service
    const { data, totalRecords, totalPages, prevPage, nextPage } = yield (0, order_services_1.findOrdersByUserEmail)(userEmail, page, limit, sortOption);
    // Response object
    const response = {
        success: true,
        message: "All orders fetched successfully.",
        data,
        pagination: {
            totalRecords,
            totalPages,
            prevPage,
            nextPage,
            currentPage: page,
        },
    };
    yield (0, cache_1.setCache)(cacheKey, response, 60); // cache for 60 seconds
    res.status(200).json(response);
}));
exports.getUserSingleOrder = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { orderId } = req.params;
    const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!userEmail) {
        throw new customError_1.default("user not found", 404);
    }
    const cachedKey = `orders_${userEmail}_${orderId}`;
    const cachedOrders = yield (0, cache_1.getCache)(cachedKey);
    if (cachedOrders) {
        return res.json(JSON.parse(cachedOrders));
    }
    const order = yield (0, order_services_1.findOrderById)(orderId, userEmail);
    if (!order) {
        throw new customError_1.default("Order not found", 404);
    }
    const response = {
        message: 'Order retrieve successfully',
        order
    };
    yield (0, cache_1.setCache)(cachedKey, response, 60);
    res.status(200).json(response);
}));
// Update order status (Only vendor can update)
exports.changeOrderStatus = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { orderId } = req.params;
    const { status } = req.body;
    const vendorEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    console.log(req.body);
    console.log(status);
    if (!vendorEmail) {
        throw new customError_1.default("user not found", 404);
    }
    const cachedKey = `orders_${vendorEmail}`;
    const updatedOrder = yield (0, order_services_1.updateOrderStatus)(orderId, vendorEmail, status);
    if (!updatedOrder) {
        throw new customError_1.default("Not authorized to update this order", 403);
    }
    yield (0, cache_1.deleteCache)(cachedKey);
    yield (0, cache_1.deleteCacheByPattern)("orders_*");
    res.json(updatedOrder);
}));
// Get vendor orders
exports.vendorOrders = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const vendorEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!vendorEmail) {
        throw new customError_1.default("User not found", 404);
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    // Sorting logic
    const sortParam = req.query.sort || "createdAt:desc";
    const [field, order] = sortParam.split(":");
    const sort = {
        [field]: order === "asc" ? 1 : -1,
    };
    // Cache key includes sort info
    const cacheKey = `orders_${vendorEmail}_page_${page}_limit_${limit}_sort_${field}_${order}`;
    const cached = yield (0, cache_1.getCache)(cacheKey);
    if (cached) {
        return res.json(JSON.parse(cached));
    }
    const result = yield (0, order_services_1.getVendorOrders)(vendorEmail, page, limit, sort);
    const response = {
        success: true,
        message: "Orders fetched successfully.",
        data: result.data,
        pagination: {
            totalRecords: result.totalRecords,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            currentPage: page,
        },
    };
    yield (0, cache_1.setCache)(cacheKey, response, 60); // Cache for 60 seconds
    res.status(200).json(response);
}));
