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
exports.createPaymentIntent = void 0;
const stripe_1 = __importDefault(require("stripe"));
const secret_1 = require("../../secret");
const TryCatch_1 = require("../../middlewares/TryCatch");
const customError_1 = __importDefault(require("../../utils/errors/customError"));
const stripe = new stripe_1.default(secret_1.stripeSecretKey);
exports.createPaymentIntent = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { price } = req.body;
    if (!price || isNaN(Number(price))) {
        throw new customError_1.default("Invalid price", 404);
    }
    const amount = Math.round(parseFloat(price) * 100);
    const paymentIntent = yield stripe.paymentIntents.create({
        amount,
        currency: "usd",
        payment_method_types: ["card"],
    });
    res.status(200).send({
        clientSecret: paymentIntent.client_secret,
    });
}));
