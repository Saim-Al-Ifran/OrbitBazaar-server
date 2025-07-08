"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("../../controllers/payment/payment.controller");
const router = express_1.default.Router();
router.post('/create_payment_intent', payment_controller_1.createPaymentIntent);
// router.post('/confirm-payment',authenticate,confirmPayment);
exports.default = router;
