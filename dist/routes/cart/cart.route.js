"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = __importDefault(require("../../middlewares/auth/authenticate"));
const cart_controller_1 = require("../../controllers/cart/cart.controller");
const router = express_1.default.Router();
router.get("/cart", authenticate_1.default, cart_controller_1.getCart);
router.post("/cart", authenticate_1.default, cart_controller_1.addToCart);
router.delete("/cart", authenticate_1.default, cart_controller_1.clearCart);
router.put("/cart/item/:productId", authenticate_1.default, cart_controller_1.editCartItem);
router.delete("/cart/item/:productId", authenticate_1.default, cart_controller_1.removeCartItem);
exports.default = router;
