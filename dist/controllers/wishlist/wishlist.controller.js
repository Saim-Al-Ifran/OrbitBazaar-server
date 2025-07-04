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
exports.removeAllProductFromWishlist = exports.removeProductFromWishlist = exports.getAllWishlist = exports.addToWishlist = void 0;
const TryCatch_1 = require("../../middlewares/TryCatch");
const wishlist_services_1 = require("../../services/wishlist/wishlist.services");
const customError_1 = __importDefault(require("../../utils/errors/customError"));
const cache_1 = require("../../utils/cache");
exports.addToWishlist = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { productId } = req.body;
    const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!userEmail) {
        throw new customError_1.default("user not found!", 404);
    }
    const wishlist = yield (0, wishlist_services_1.createWishlist)(userEmail, productId);
    yield (0, cache_1.deleteCache)(`wishlist_${userEmail}`);
    res.status(200).json({ message: "Product added to wishlist", wishlist });
}));
exports.getAllWishlist = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!userEmail) {
        throw new customError_1.default("user not found!", 404);
    }
    const cachedKey = `wishlist_${userEmail}`;
    const cachedWishlist = yield (0, cache_1.getCache)(cachedKey);
    if (cachedWishlist) {
        return res.json(JSON.parse(cachedWishlist));
    }
    const wishlist = yield (0, wishlist_services_1.findWishlist)(userEmail);
    yield (0, cache_1.setCache)(cachedKey, wishlist, 60);
    res.status(200).json(wishlist);
}));
exports.removeProductFromWishlist = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    const { productId } = req.params;
    if (!userEmail) {
        throw new customError_1.default("user not found!", 404);
    }
    const updatedWishlist = yield (0, wishlist_services_1.deleteProductFromWishlist)(userEmail, productId);
    yield (0, cache_1.deleteCache)(`wishlist_${userEmail}`);
    res.status(200).json({ message: "Product removed from wishlist", wishlist: updatedWishlist });
}));
exports.removeAllProductFromWishlist = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!userEmail) {
        throw new customError_1.default("user not found!", 404);
    }
    const wishlistResponse = yield (0, wishlist_services_1.deleteAllWishlist)(userEmail);
    yield (0, cache_1.deleteCache)(`wishlist_${userEmail}`);
    res.status(200).json({ message: "Wishlist cleared", wishlist: wishlistResponse });
}));
