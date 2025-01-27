import { Request, Response, NextFunction } from 'express';
import { TryCatch } from '../../middlewares/TryCatch';

export const addReview = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {}
) 
export const getProductReviews = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {}
) 
export const editReview = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {}
) 
export const deleteReview = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {}
) 
export const getUserReviews = TryCatch(
    async (req: Request, res: Response, next: NextFunction) => {}
) 

 