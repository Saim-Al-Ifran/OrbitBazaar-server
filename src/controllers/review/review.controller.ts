import { Request, Response, NextFunction } from 'express';
import { TryCatch } from '../../middlewares/TryCatch';
import {
    createReview,
    deleteReviewInDb,
    findProductReviews,
    findUserReview,
    findUserReviews,
    updateReview
} from '../../services/review/review.services';
import CustomError from '../../utils/errors/customError';
import { deleteCache, deleteCacheByPattern, getCache, setCache } from '../../utils/cache';

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
    async (req: Request, res: Response, _next: NextFunction):Promise<Response>  => {
      const { id } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortField = (req.query.sortField as string) || 'createdAt'; 
      const sortOrder = (req.query.sortOrder as string) || 'dsc';  

      // caching review data
      const cacheKey = `reviews_page_${page}_limit_${limit}_${sortField}_${sortOrder}_id_${id}`;
      const cachedReviews = await getCache(cacheKey);
      if(cachedReviews){
       return res.json(JSON.parse(cachedReviews));
      }

      const { data, totalRecords, totalPages, prevPage, nextPage } = await findProductReviews(id, page, limit, sortField, sortOrder);
  
      if (data.length === 0) {
        throw new CustomError('No reviews found', 404);
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
      await setCache(cacheKey,reviewResponse, 60);
      return res.status(200).json(reviewResponse);
    }
  );
export const editReview = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
        const { reviewId} = req.params;
        const { rating, comment } = req.body;
        const userEmail = req.user?.email;
        const cacheKey = `reviews_${reviewId}_${userEmail}`;
        if(!userEmail){
            throw new CustomError("user not found", 404);
        }
        const review = await  updateReview(reviewId, userEmail, { rating, comment });
        // delete from cache
        await deleteCacheByPattern("reviews_page_*");
        await deleteCache(cacheKey);
        res.status(200).json({ message: 'Revsiew updated successfully', review });
    }
) 
export const deleteReview = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
        const {reviewId} = req.params;
        const userEmail = req.user?.email;
        const cacheKey = `reviews_${reviewId}_${userEmail}`;
        if(!userEmail){
            throw new CustomError("user not found", 404);
        }
        await  deleteReviewInDb(reviewId, userEmail);
        // delete from cache
        await deleteCacheByPattern("reviews_page_*");
        await deleteCache(cacheKey);
        res.status(200).json({ message: 'Review deleted successfully' });
    }
) 
export const getUserReviews = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
      const userEmail = req.user?.email;
  
      if (!userEmail) {
        throw new CustomError("User not found", 404);
      }
  
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortField = (req.query.sortField as string) || 'createdAt';  
      const sortOrder = (req.query.sortOrder as string) || 'dsc';

      const cacheKey = `reviews_page_${page}_limit_${limit}_${sortField}_${sortOrder}_user_${userEmail}`;
      const cachedReviews = await getCache(cacheKey);
      if(cachedReviews){
       return res.json(JSON.parse(cachedReviews));
      }  
  
      const { data, totalRecords, totalPages, prevPage, nextPage } = await findUserReviews(userEmail, page, limit, sortField, sortOrder);
  
      if (data.length === 0) {
        throw new CustomError('No reviews found', 404);
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
      }
      await setCache(cacheKey, reviewResponse, 60);
      return res.status(200).json(reviewResponse);
    }
);
export const getUserReview = TryCatch(
  async(req: Request, res: Response, _next: NextFunction)=>{
    const {reviewId} = req.params;
    const userEmail = req.user?.email;

    const cacheKey = `reviews_${reviewId}_${userEmail}`;
    const cachedReview = await getCache(cacheKey);
    if(cachedReview){
      return res.json(JSON.parse(cachedReview));
    }

    if(!userEmail){
      throw new CustomError("user not found", 404);
    }
    const review = await findUserReview(userEmail, reviewId);
    if(!review){
      throw new CustomError("Review not found", 404);
    }
    const reviewResponse = {
      success: true,
      message: "Review fetched successfully",
      data: review
    }
    await setCache(cacheKey,reviewResponse,60);
    return res.json(reviewResponse);
  }
)