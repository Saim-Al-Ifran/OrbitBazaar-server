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
exports.getVendorOrders = exports.getAllOrders = exports.cancelOrder = exports.updateOrderStatus = exports.findOrderById = exports.findOrdersByUserEmail = exports.createOrder = void 0;
const Order_1 = __importDefault(require("../../models/Order"));
const Product_1 = __importDefault(require("../../models/Product"));
const paginate_1 = __importDefault(require("../../utils/paginate"));
// Create a new order
const createOrder = (orderData) => __awaiter(void 0, void 0, void 0, function* () {
    const newOrder = new Order_1.default(orderData);
    return yield newOrder.save();
});
exports.createOrder = createOrder;
// Get orders by user email
const findOrdersByUserEmail = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Order_1.default.find({ userEmail });
});
exports.findOrdersByUserEmail = findOrdersByUserEmail;
// Get order by ID
const findOrderById = (orderId, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ orderId, userEmail });
    return yield Order_1.default.findOne({ _id: orderId, userEmail }).populate('items.productID');
});
exports.findOrderById = findOrderById;
// Update order status (only if vendor owns the product)
const updateOrderStatus = (orderId, vendorEmail, status) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield Order_1.default.findById(orderId).populate('items.productID');
    if (!order)
        return null;
    const isVendorAuthorized = order.items.every(item => item.productID.vendorEmail === vendorEmail);
    if (!isVendorAuthorized)
        return null;
    return yield Order_1.default.findByIdAndUpdate(orderId, { status }, { new: true });
});
exports.updateOrderStatus = updateOrderStatus;
// Cancel order (only if vendor owns the product)
const cancelOrder = (orderId, vendorEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield Order_1.default.findById(orderId).populate('items.productID');
    if (!order)
        return null;
    const isVendorAuthorized = order.items.every(item => item.productID.vendorEmail === vendorEmail);
    if (!isVendorAuthorized)
        return null;
    return yield Order_1.default.findByIdAndUpdate(orderId, { status: 'Cancelled' }, { new: true });
});
exports.cancelOrder = cancelOrder;
// Get all orders (for admin or vendor-specific filtering)
const getAllOrders = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filter = {}) {
    return yield Order_1.default.find(filter).populate('items.productID');
});
exports.getAllOrders = getAllOrders;
// Get vendor orders (orders containing vendor's products)
const getVendorOrders = (vendorEmail, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Product_1.default.find({ vendorEmail }).select("_id");
    const productIds = products.map((product) => product._id);
    if (!productIds.length) {
        return {
            data: [],
            totalRecords: 0,
            totalPages: 0,
            prevPage: null,
            nextPage: null,
            page,
        };
    }
    return yield (0, paginate_1.default)(Order_1.default, { "items.productID": { $in: productIds } }, page, limit, { createdAt: -1 }, // optional sorting
    "", // projection
    "items.productID" // populate
    );
});
exports.getVendorOrders = getVendorOrders;
