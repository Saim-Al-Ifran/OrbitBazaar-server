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
exports.updateCartItemQuantity = exports.deleteCartItem = exports.updateCartItem = exports.deleteAllCart = exports.createCart = exports.findCart = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Cart_1 = __importDefault(require("../../models/Cart"));
const product_services_1 = require("../product/product.services");
// Fetch the current cart for the authenticated user.
const findCart = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Cart_1.default.findOne({ userEmail }).populate({
        path: "items.productID",
        select: "price images name stock",
    });
});
exports.findCart = findCart;
// Add a product to the cart. 
const createCart = (userEmail, productID, quantity, price) => __awaiter(void 0, void 0, void 0, function* () {
    let cart = yield Cart_1.default.findOne({ userEmail });
    if (!cart) {
        cart = new Cart_1.default({ userEmail, items: [], totalQuantity: 0, totalPrice: 0 });
    }
    const existingItem = cart.items.find((item) => item.productID.toString() === productID);
    let message = '';
    let updatedQuantity = quantity;
    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.total = existingItem.quantity * price;
        updatedQuantity = existingItem.quantity;
        message = 'Quantity updated';
    }
    else {
        cart.items.push({
            productID: new mongoose_1.default.Types.ObjectId(productID),
            quantity,
            price,
            total: quantity * price,
        });
        message = 'Added to cart';
    }
    // Recalculate total quantity and price
    cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.total, 0);
    yield cart.save();
    return {
        message,
        productId: productID,
        updatedQuantity,
        cart,
    };
});
exports.createCart = createCart;
// Remove all items from the cart.
const deleteAllCart = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Cart_1.default.findOneAndUpdate({ userEmail }, { items: [], totalQuantity: 0, totalPrice: 0 }, { new: true });
});
exports.deleteAllCart = deleteAllCart;
/**
 * Update the quantity of a specific product in the cart.
 * If quantity is 0, the item is removed.
 */
const updateCartItem = (userEmail, productID, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield Cart_1.default.findOne({ userEmail });
    if (!cart)
        throw new Error("Cart not found");
    const item = cart.items.find((item) => item.productID.toString() === productID);
    if (!item)
        throw new Error("Item not found in cart");
    // Fetch the actual product to check stock
    const product = yield (0, product_services_1.findProductById)(productID);
    if (!product)
        throw new Error("Product not found");
    if (quantity > product.stock) {
        throw new Error(`Sorry, only ${product.stock} unit${product.stock > 1 ? 's' : ''} are available in stock.`);
    }
    if (quantity === 0) {
        cart.items = cart.items.filter((item) => item.productID.toString() !== productID);
    }
    else {
        item.quantity = quantity;
        item.total = item.quantity * item.price;
    }
    cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.total, 0);
    yield cart.save();
    return cart;
});
exports.updateCartItem = updateCartItem;
//  Remove a specific product from the cart.
const deleteCartItem = (userEmail, productID) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield Cart_1.default.findOne({ userEmail });
    if (!cart)
        throw new Error("Cart not found");
    cart.items = cart.items.filter((item) => item.productID.toString() !== productID);
    cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.total, 0);
    yield cart.save();
    return cart;
});
exports.deleteCartItem = deleteCartItem;
const updateCartItemQuantity = (userEmail, productId, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield Cart_1.default.findOne({ userEmail });
    if (!cart) {
        throw new Error("Cart not found");
    }
    const itemIndex = cart.items.findIndex(item => item.productID.toString() === productId);
    if (itemIndex === -1) {
        throw new Error("Product not found in cart");
    }
    // Update the quantity
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].total = cart.items[itemIndex].price * quantity;
    // Recalculate totalQuantity and totalPrice
    cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.total, 0);
    yield cart.save();
    return cart;
});
exports.updateCartItemQuantity = updateCartItemQuantity;
