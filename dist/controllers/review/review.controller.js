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
exports.getUserReviews = exports.deleteReview = exports.editReview = exports.getProductReviews = exports.addReview = void 0;
const TryCatch_1 = require("../../middlewares/TryCatch");
const review_services_1 = require("../../services/review/review.services");
const customError_1 = __importDefault(require("../../utils/errors/customError"));
exports.addReview = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { productId, rating, comment } = req.body;
    const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!userEmail) {
        throw new customError_1.default("user not found", 404);
    }
    const review = yield (0, review_services_1.createReview)(userEmail, productId, rating, comment);
    res.status(201).json({ message: 'Review added successfully', review });
}));
exports.getProductReviews = (0, TryCatch_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () { }));
exports.editReview = (0, TryCatch_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () { }));
exports.deleteReview = (0, TryCatch_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () { }));
exports.getUserReviews = (0, TryCatch_1.TryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!userEmail) {
        throw new customError_1.default("user not found", 404);
    }
    const reviews = yield (0, review_services_1.findUserReviews)(userEmail);
    if (reviews.length === 0) {
        throw new customError_1.default("No reviews found", 404);
    }
    res.status(200).json({ reviews });
}));
