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
exports.deleteAllWishlist = exports.deleteWishlist = exports.getWishlist = exports.addToWishlist = void 0;
const Wishlist_1 = __importDefault(require("../../models/Wishlist"));
//  Add a product to the user's wishlist
const addToWishlist = (userEmail, productID) => __awaiter(void 0, void 0, void 0, function* () {
    let wishlist = yield Wishlist_1.default.findOne({ userEmail });
    if (!wishlist) {
        wishlist = new Wishlist_1.default({ userEmail, items: [{ productID }] });
    }
    else {
        if (wishlist.items.some((item) => item.productID.toString() === productID)) {
            throw new Error("Product already in wishlist");
        }
        wishlist.items.push({
            productID,
            addedAt: new Date(),
        });
    }
    return yield wishlist.save();
});
exports.addToWishlist = addToWishlist;
// Get all wishlist items for a user
const getWishlist = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Wishlist_1.default.findOne({ userEmail }).populate("items.productID");
});
exports.getWishlist = getWishlist;
// Remove a specific product from the wishlist
const deleteWishlist = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    yield Wishlist_1.default.deleteOne({ userEmail });
});
exports.deleteWishlist = deleteWishlist;
// Clear the entire wishlist for a user
const deleteAllWishlist = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Wishlist_1.default.findOneAndDelete({ userEmail });
});
exports.deleteAllWishlist = deleteAllWishlist;
