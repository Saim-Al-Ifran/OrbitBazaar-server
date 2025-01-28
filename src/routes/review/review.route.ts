import express from 'express';
import authenticate from '../../middlewares/auth/authenticate';
import {
    addReview,
    deleteReview,
    editReview,
    getProductReviews,
    getUserReviews
} from '../../controllers/review/review.controller';
 
 
 
const router = express.Router();

router.post('/reviews', authenticate, addReview);
router.get('/reviews/user',  authenticate, getUserReviews );
router.get('/reviews/:id', getProductReviews);
router.put('/reviews/:id', authenticate, editReview);
router.delete('/reviews/:id',  authenticate, deleteReview);


export default router;
