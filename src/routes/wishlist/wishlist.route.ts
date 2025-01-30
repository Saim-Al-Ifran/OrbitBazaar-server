import express from 'express';
import authenticate from '../../middlewares/auth/authenticate';
import {
    addToWishlist,
    getAllWishlist,
    removeAllProductFromWishlist,
    removeProductFromWishlist
} from '../../controllers/wishlist/wishlist.controller';
   
const router = express.Router();

 
router.post("/wishlist",  authenticate, addToWishlist);
router.get("/wishlist",  authenticate, getAllWishlist);
router.delete("/wishlist/:productId",  authenticate, removeProductFromWishlist);
router.delete("/wishlist",  authenticate, removeAllProductFromWishlist);

export default router;
