import { Request, Response, NextFunction } from 'express';
import { TryCatch } from '../../middlewares/TryCatch';
import {
    createReview,
    deleteReviewInDb,
    findProductReviews,
    findUserReviews,
    updateReview
} from '../../services/review/review.services';
import CustomError from '../../utils/errors/customError';

export const addReview = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
        const { productId, rating, comment } = req.body;
        const userEmail = req.user?.email;
        if(!userEmail){
            throw new CustomError("user not found", 404);
        }
        const review = await createReview(userEmail, productId, rating, comment);
    
        res.status(201).json({ message: 'Review added successfully', review });
    }
) 
export const getProductReviews = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
        const {id} = req.params;
        const reviews = await findProductReviews(id as string);
        if(reviews.length  === 0){
            throw new CustomError('No reviews found', 404);
        }
        res.status(200).json({ reviews });
    }
) 
export const editReview = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const userEmail = req.user?.email;
        if(!userEmail){
            throw new CustomError("user not found", 404);
        }
        const review = await  updateReview(id, userEmail, { rating, comment });
    
        res.status(200).json({ message: 'Review updated successfully', review });
    }
) 
export const deleteReview = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
        const {id} = req.params;
        const userEmail = req.user?.email;
        if(!userEmail){
            throw new CustomError("user not found", 404);
        }
        await  deleteReviewInDb(id, userEmail);
        res.status(200).json({ message: 'Review deleted successfully' });
    }
) 
export const getUserReviews = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {
        const userEmail = req.user?.email;
        console.log("helooo");
        
        if(!userEmail){
            throw new CustomError("user not found", 404);
        }
        const reviews = await findUserReviews(userEmail);
        if(reviews.length === 0){
            throw new CustomError("No reviews found",404);
        }
    
        res.status(200).json({ reviews });
    }
) 

 