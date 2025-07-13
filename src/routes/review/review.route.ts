import express from 'express';
import authenticate from '../../middlewares/auth/authenticate';
import {
    addReview,
    deleteReview,
    editReview,
    getProductReviews,
    getUserReview,
    getUserReviewIds,
    getUserReviews
} from '../../controllers/review/review.controller';
 
 
 
const router = express.Router();

router.post('/reviews', authenticate, addReview);
router.get('/reviews/user',  authenticate, getUserReviews );
router.get('/reviews/user_reviews_Id',authenticate,getUserReviewIds)
router.get('/reviews/:id', getProductReviews);
router.get('/reviews/user/:reviewId', authenticate, getUserReview);
router.put('/reviews/user/:reviewId', authenticate, editReview);
router.delete('/reviews/user/:reviewId',  authenticate, deleteReview);


export default router;
