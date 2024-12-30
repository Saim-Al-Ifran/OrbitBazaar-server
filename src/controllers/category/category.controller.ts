import {Response,Request,NextFunction } from "express";
import { TryCatch } from "../../middlewares/TryCatch";
import {
  createCategory,
  deleteCategoryFromDb,
  deleteCategoryImage,
  findCategoryById,
  getAllCategories,
  getAllCategoriesForAdmin,
  updateCategoryInDb,
  uploadCategoryImage
} from "../../services/category/category.services";
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
export const updateCategory  = TryCatch(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const updates = req.body;
    const file = req.file;
 
    const category = await findCategoryById(id);
    if (!category) {
      throw new CustomError("Category not found.", 404);
    }

   
    if (file) {
      if (category.image) {
        await deleteCategoryImage(category.image);  
      }
      const newImageUrl = await uploadCategoryImage(file);
      updates.image = newImageUrl;  
    }

    const updatedCategory = await updateCategoryInDb(id, updates);

    res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: updatedCategory,
    });
  }
);

export const deleteCategory = TryCatch(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;

    // Check if category exists
    const category = await findCategoryById(id);
    if (!category) {
      throw new CustomError("Category not found.", 404);
    }

    // Delete the category image from Cloudinary (if exists)
    if (category.image) {
      await deleteCategoryImage(category.image);
    }

    // Delete the category from the database
    await deleteCategoryFromDb(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  }
);