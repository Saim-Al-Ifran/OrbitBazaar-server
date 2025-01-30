"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = __importDefault(require("../../middlewares/auth/authenticate"));
const wishlist_controller_1 = require("../../controllers/wishlist/wishlist.controller");
const router = express_1.default.Router();
router.post("/wishlist", authenticate_1.default, wishlist_controller_1.addToWishlist);
router.get("/wishlist", authenticate_1.default, wishlist_controller_1.getAllWishlist);
router.delete("/wishlist/:productId", authenticate_1.default, wishlist_controller_1.removeProductFromWishlist);
router.delete("/wishlist", authenticate_1.default, wishlist_controller_1.removeAllProductFromWishlist);
exports.default = router;
