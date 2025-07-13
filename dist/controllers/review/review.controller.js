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
exports.getUserReview = exports.getUserReviews = exports.deleteReview = exports.editReview = exports.getProductReviews = exports.addReview = void 0;
const TryCatch_1 = require("../../middlewares/TryCatch");
const review_services_1 = require("../../services/review/review.services");
const customError_1 = __importDefault(require("../../utils/errors/customError"));
const cache_1 = require("../../utils/cache");
exports.addReview = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { productId, rating, comment } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId) {
        throw new customError_1.default("User not found", 404);
    }
    const review = yield (0, review_services_1.createReview)(userId, productId, rating, comment);
    res.status(201).json({ message: 'Review added successfully', review });
}));
exports.getProductReviews = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder || 'dsc';
    // caching review data
    const cacheKey = `reviews_page_${page}_limit_${limit}_${sortField}_${sortOrder}_id_${id}`;
    const cachedReviews = yield (0, cache_1.getCache)(cacheKey);
    if (cachedReviews) {
        return res.json(JSON.parse(cachedReviews));
    }
    const { data, totalRecords, totalPages, prevPage, nextPage } = yield (0, review_services_1.findProductReviews)(id, page, limit, sortField, sortOrder);
    if (data.length === 0) {
        throw new customError_1.default('No reviews found', 404);
    }
    const reviewResponse = {
        success: true,
        message: "Reviews fetched successfully.",
        data,
        pagination: {
            totalRecords,
            totalPages,
            prevPage,
            nextPage,
            currentPage: page,
        },
    };
    yield (0, cache_1.setCache)(cacheKey, reviewResponse, 60);
    return res.status(200).json(reviewResponse);
}));
exports.editReview = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId) {
        throw new customError_1.default("User not found", 404);
    }
    const cacheKey = `reviews_${reviewId}_${userId}`;
    const review = yield (0, review_services_1.updateReview)(reviewId, userId, { rating, comment });
    // delete from cache
    yield (0, cache_1.deleteCacheByPattern)("reviews_page_*");
    yield (0, cache_1.deleteCache)(cacheKey);
    res.status(200).json({ message: 'Review updated successfully', review });
}));
exports.deleteReview = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { reviewId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId) {
        throw new customError_1.default('User not found', 404);
    }
    const cacheKey = `reviews_${reviewId}_${userId}`;
    yield (0, review_services_1.deleteReviewInDb)(reviewId, userId);
    // Delete relevant cache
    yield (0, cache_1.deleteCacheByPattern)("reviews_page_*");
    yield (0, cache_1.deleteCache)(cacheKey);
    res.status(200).json({ message: 'Review deleted successfully' });
}));
exports.getUserReviews = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId) {
        throw new customError_1.default("User not found", 404);
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder || 'dsc';
    const cacheKey = `reviews_page_${page}_limit_${limit}_${sortField}_${sortOrder}_user_${userId}`;
    const cachedReviews = yield (0, cache_1.getCache)(cacheKey);
    if (cachedReviews) {
        return res.json(JSON.parse(cachedReviews));
    }
    const { data, totalRecords, totalPages, prevPage, nextPage } = yield (0, review_services_1.findUserReviews)(userId, page, limit, sortField, sortOrder);
    const reviewResponse = {
        success: true,
        message: "Reviews fetched successfully.",
        data,
        pagination: {
            totalRecords,
            totalPages,
            prevPage,
            nextPage,
            currentPage: page,
        },
    };
    yield (0, cache_1.setCache)(cacheKey, reviewResponse, 60);
    return res.status(200).json(reviewResponse);
}));
exports.getUserReview = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { reviewId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId) {
        throw new customError_1.default("User not found", 404);
    }
    const cacheKey = `reviews_${reviewId}_${userId}`;
    const cachedReview = yield (0, cache_1.getCache)(cacheKey);
    if (cachedReview) {
        return res.json(JSON.parse(cachedReview));
    }
    const review = yield (0, review_services_1.findUserReview)(userId, reviewId);
    if (!review) {
        throw new customError_1.default("Review not found", 404);
    }
    const reviewResponse = {
        success: true,
        message: "Review fetched successfully",
        data: review,
    };
    yield (0, cache_1.setCache)(cacheKey, reviewResponse, 60);
    return res.json(reviewResponse);
}));
