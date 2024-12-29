import {Response,Request,NextFunction } from "express";
import { TryCatch } from "../../middlewares/TryCatch";
import { getAllCategories } from "../../services/category/category.services";

export const findAllCategories = TryCatch(
    async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const categories = await getAllCategories();
        res.status(200).json({
          success: true,
          data: categories,
        });
    }
)