"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = __importDefault(require("../../middlewares/auth/authenticate"));
const review_controller_1 = require("../../controllers/review/review.controller");
const router = express_1.default.Router();
router.post('/reviews', authenticate_1.default, review_controller_1.addReview);
router.get('/reviews/user', authenticate_1.default, review_controller_1.getUserReviews);
router.get('/reviews/user_reviews_Id', authenticate_1.default, review_controller_1.getUserReviewIds);
router.get('/reviews/:id', review_controller_1.getProductReviews);
router.get('/reviews/user/:reviewId', authenticate_1.default, review_controller_1.getUserReview);
router.put('/reviews/user/:reviewId', authenticate_1.default, review_controller_1.editReview);
router.delete('/reviews/user/:reviewId', authenticate_1.default, review_controller_1.deleteReview);
exports.default = router;
