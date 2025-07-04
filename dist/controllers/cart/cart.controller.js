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
exports.removeCartItem = exports.editCartItem = exports.clearCart = exports.addToCart = exports.getCart = void 0;
const customError_1 = __importDefault(require("../../utils/errors/customError"));
const TryCatch_1 = require("../../middlewares/TryCatch");
const cart_services_1 = require("../../services/cart/cart.services");
const cache_1 = require("../../utils/cache");
exports.getCart = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!userEmail) {
        throw new customError_1.default("user not found!", 404);
    }
    const cachedKey = `cart_${userEmail}`;
    const cachedCart = yield (0, cache_1.getCache)(cachedKey);
    if (cachedCart) {
        return res.json(JSON.parse(cachedCart));
    }
    let cart = yield (0, cart_services_1.findCart)(userEmail);
    if (!cart) {
        // If no cart found, return an empty cart response, not a fake ICart object
        yield (0, cache_1.setCache)(cachedKey, null, 60);
        return res.status(200).json({
            userEmail,
            items: [],
            totalQuantity: 0,
            totalPrice: 0
        });
    }
    yield (0, cache_1.setCache)(cachedKey, cart, 60);
    res.status(200).json(cart);
}));
exports.addToCart = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { productId, quantity, price } = req.body;
    const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!userEmail) {
        throw new customError_1.default("User not found!", 404);
    }
    const cachedKey = `cart_${userEmail}`;
    const result = yield (0, cart_services_1.createCart)(userEmail, productId, quantity, price);
    yield (0, cache_1.deleteCache)(cachedKey);
    // Return the dynamic message and useful info
    res.status(201).json({
        message: result.message, // "Added to cart" or "Quantity updated"
        productId: result.productId,
        updatedQuantity: result.updatedQuantity,
        cart: result.cart,
    });
}));
exports.clearCart = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!userEmail) {
        throw new customError_1.default("user not found!", 404);
    }
    const cachedKey = `cart_${userEmail}`;
    const cart = yield (0, cart_services_1.deleteAllCart)(userEmail);
    yield (0, cache_1.deleteCache)(cachedKey);
    res.status(200).json(cart);
}));
exports.editCartItem = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { productId } = req.params;
    const { quantity } = req.body;
    const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!userEmail) {
        throw new customError_1.default("user not found!", 404);
    }
    const cachedKey = `cart_${userEmail}`;
    const cart = yield (0, cart_services_1.updateCartItem)(userEmail, productId, quantity);
    yield (0, cache_1.deleteCache)(cachedKey);
    res.status(200).json(cart);
}));
exports.removeCartItem = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { productId } = req.params;
    const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!userEmail) {
        throw new customError_1.default("user not found!", 404);
    }
    const cachedKey = `cart_${userEmail}`;
    const cart = yield (0, cart_services_1.deleteCartItem)(userEmail, productId);
    yield (0, cache_1.deleteCache)(cachedKey);
    res.status(200).json(cart);
}));
// export const updateCartItem =  TryCatch(
//     async(req:Request,res:Response,_next:NextFunction)=>{
//         const { productId } = req.params;
//         const userEmail = req.user?.email;
//         if(!userEmail){
//             throw new CustomError("user not found!", 404);
//         }
//         const cachedKey = `cart_${userEmail}`;
//         const cart = await deleteCartItem(userEmail, productId);
//         await deleteCache(cachedKey);
//         res.status(200).json(cart);
//     }
// )
