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
exports.getReviewIdsByUser = exports.findUserReview = exports.findUserReviews = exports.findProductReviews = exports.deleteReviewInDb = exports.updateReview = exports.createReview = exports.recalculateProductRating = void 0;
const Order_1 = __importDefault(require("../../models/Order"));
const Product_1 = __importDefault(require("../../models/Product"));
const Review_1 = __importDefault(require("../../models/Review"));
const customError_1 = __importDefault(require("../../utils/errors/customError"));
const paginate_1 = __importDefault(require("../../utils/paginate"));
// utitly function to calculate rating
const recalculateProductRating = (productID) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield Review_1.default.find({ productID });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length ? totalRating / reviews.length : 0;
    const ratingCount = reviews.length;
    yield Product_1.default.findByIdAndUpdate(productID, {
        ratings: {
            average: averageRating,
            count: ratingCount
        }
    });
});
exports.recalculateProductRating = recalculateProductRating;
// added review 
const createReview = (userId, productID, rating, comment) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if user purchased the product
    const hasPurchased = yield Order_1.default.findOne({
        user: userId,
        'items.productID': productID,
    });
    if (!hasPurchased) {
        throw new customError_1.default('You can only review products you have purchased.', 403);
    }
    // Check if user already reviewed the product
    const existingReview = yield Review_1.default.exists({ user: userId, productID });
    if (existingReview) {
        throw new customError_1.default('You have already reviewed this product', 400);
    }
    // Create review
    const review = yield Review_1.default.create({
        productID,
        user: userId,
        rating,
        comment,
    });
    // Update product rating
    yield (0, exports.recalculateProductRating)(productID);
    return review;
});
exports.createReview = createReview;
//  Updates an existing review.
const updateReview = (reviewID, userId, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield Review_1.default.findOneAndUpdate({ _id: reviewID, user: userId }, updatedData, { new: true });
    if (!review) {
        throw new customError_1.default('Review not found', 403);
    }
    // Recalculate product rating after the update
    yield (0, exports.recalculateProductRating)(review.productID.toString());
    return review;
});
exports.updateReview = updateReview;
// Deletes a user's review by ID.
const deleteReviewInDb = (reviewID, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield Review_1.default.findOneAndDelete({ _id: reviewID, user: userId });
    if (!review) {
        throw new customError_1.default('Review not found', 403);
    }
    // Recalculate product rating after deletion
    yield (0, exports.recalculateProductRating)(review.productID.toString());
    return review;
});
exports.deleteReviewInDb = deleteReviewInDb;
// Retrieves all reviews for a specific product.
const findProductReviews = (productID_1, page_1, limit_1, ...args_1) => __awaiter(void 0, [productID_1, page_1, limit_1, ...args_1], void 0, function* (productID, page, limit, sortField = 'createdAt', sortOrder = 'dsc') {
    const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
    return yield (0, paginate_1.default)(Review_1.default, { productID }, page, limit, sort, 'rating comment createdAt user', {
        path: 'user',
        select: 'name email image',
    });
});
exports.findProductReviews = findProductReviews;
// Retrieves all reviews by a specific user.
const findUserReviews = (userId_1, page_1, limit_1, ...args_1) => __awaiter(void 0, [userId_1, page_1, limit_1, ...args_1], void 0, function* (userId, page, limit, sortField = 'createdAt', sortOrder = 'dsc') {
    const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
    return yield (0, paginate_1.default)(Review_1.default, { user: userId }, page, limit, sort, 'rating comment createdAt', {
        path: 'productID',
        select: 'name images'
    });
});
exports.findUserReviews = findUserReviews;
const findUserReview = (userId, reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Review_1.default.findOne({ user: userId, _id: reviewId })
        .select('rating comment createdAt productID')
        .populate('productID', 'name images');
});
exports.findUserReview = findUserReview;
const getReviewIdsByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield Review_1.default.find({ user: userId }).select('productID');
    const productIds = reviews.map((review) => review.productID.toString());
    // Remove duplicates
    return [...new Set(productIds)];
});
exports.getReviewIdsByUser = getReviewIdsByUser;
