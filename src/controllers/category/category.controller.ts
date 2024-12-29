import {Response,Request,NextFunction } from "express";
import { TryCatch } from "../../middlewares/TryCatch";
import { createCategory, getAllCategories, getAllCategoriesForAdmin } from "../../services/category/category.services";
import CustomError from "../../utils/errors/customError";

export const findAllCategories = TryCatch(
    async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
        const categories = await getAllCategories();
        res.status(200).json({
          success: true,
          data: categories,
        });
    }
)

export const findAllCategoriesForAdmin = TryCatch(
  async(req:Request,res:Response,_next:NextFunction): Promise<void> =>{
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;
  
      const query = search
      ? { name: { $regex: search, $options: 'i' } }  
      : {};
      const {data,totalRecords,totalPages,prevPage,nextPage}= await getAllCategoriesForAdmin(page,limit,query);
      
      if(data.length === 0){
           throw new CustomError('No categories data found!',404);
      }

      res.status(200).json({
        success: true,
        message: "Categories fetched successfully.",
        data,
        pagination:{
            totalRecords,
            totalPages,
            prevPage,
            nextPage,
            currentPage:page
        }

      });
  }
)
export const addCategory = TryCatch(
  async(req:Request,res:Response,_next:NextFunction)=>{
    const { body, file } = req;

    if (!file) {
      throw new CustomError('Image file is required.',404);
    }
    const category = await createCategory(body, file);

    res.status(201).json({
      success: true,
      message: "Category created successfully.",
      data: category,
    });
  }
)