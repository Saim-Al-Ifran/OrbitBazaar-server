import { Request, Response, NextFunction } from 'express';
import { TryCatch } from '../../middlewares/TryCatch';
import {
    createReview,
    deleteReviewInDb,
    findProductReviews,
    findUserReview,
    findUserReviews,
    getReviewIdsByUser,
    updateReview
} from '../../services/review/review.services';
import CustomError from '../../utils/errors/customError';
import { deleteCache, deleteCacheByPattern, getCache, setCache } from '../../utils/cache';

export const addReview = TryCatch(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { productId, rating, comment } = req.body;
    const userEmail = req.user?.email as string;
    const userId = (req.user as { _id: string })?._id;

    if (!userEmail) {
      throw new CustomError("User not found", 404);
    }

    const review = await createReview(userEmail, userId, productId, rating, comment);

    // Invalidate relevant cached pages
    await deleteCacheByPattern("reviews_page_*"); // product and user reviews pagination
    await deleteCacheByPattern(`reviews_*_${userId}`); // individual reviews for this user

  
    const cacheKey = `reviews_${review._id}_${userId}`;
    await setCache(cacheKey, {
      success: true,
      message: "Review fetched successfully",
      data: review
    }, 60);

    res.status(201).json({ message: 'Review added successfully', review });
  }
);


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
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = (req.user as { _id: string })?._id;

    if (!userId) {
      throw new CustomError("User not found", 404);
    }

    const cacheKey = `reviews_${reviewId}_${userId}`;

    const review = await updateReview(reviewId, userId, { rating, comment });

    // delete from cache
    await deleteCacheByPattern("reviews_page_*");
    await deleteCache(cacheKey);

    res.status(200).json({ message: 'Review updated successfully', review });
  }
);

export const deleteReview = TryCatch(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { reviewId } = req.params;
    const userId = (req.user as { _id: string })?._id;

    if (!userId) {
      throw new CustomError('User not found', 404);
    }

    const cacheKey = `reviews_${reviewId}_${userId}`;
    await deleteReviewInDb(reviewId, userId);

    // Delete relevant cache
    await deleteCacheByPattern("reviews_page_*");
    await deleteCache(cacheKey);

    res.status(200).json({ message: 'Review deleted successfully' });
  }
);

export const getUserReviews = TryCatch(
    async (req: Request, res: Response, _next: NextFunction) => {
      const userId = (req.user as { _id: string })?._id;

      if (!userId) {
        throw new CustomError("User not found", 404);
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortField = (req.query.sortField as string) || 'createdAt';  
      const sortOrder = (req.query.sortOrder as string) || 'dsc';

      const cacheKey = `reviews_page_${page}_limit_${limit}_${sortField}_${sortOrder}_user_${userId}`;

      const cachedReviews = await getCache(cacheKey);
      if(cachedReviews){
       return res.json(JSON.parse(cachedReviews));
      }  
  
      const { data, totalRecords, totalPages, prevPage, nextPage } = await findUserReviews(userId, page, limit, sortField, sortOrder);

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
  async (req: Request, res: Response, _next: NextFunction) => {
    const { reviewId } = req.params;
    const userId = (req.user as { _id: string })?._id;

    if (!userId) {
      throw new CustomError("User not found", 404);
    }

    const cacheKey = `reviews_${reviewId}_${userId}`;
    const cachedReview = await getCache(cacheKey);
    if (cachedReview) {
      return res.json(JSON.parse(cachedReview));
    }

    const review = await findUserReview(userId, reviewId);

    if (!review) {
      throw new CustomError("Review not found", 404);
    }

    const reviewResponse = {
      success: true,
      message: "Review fetched successfully",
      data: review,
    };

    await setCache(cacheKey, reviewResponse, 60);
    return res.json(reviewResponse);
  }
);


export const getUserReviewIds = TryCatch(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user?._id as string;
    const reviewIds = await getReviewIdsByUser(userId);

    res.status(200).json({
      success: true,
      data: reviewIds,
    });
  }
);