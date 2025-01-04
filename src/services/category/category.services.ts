import Category from "../../models/Category";
import { ICategory  } from "../../types/models/Category";
import { PaginationResult } from "../../types/types";
import { deleteFileFromCloudinary } from "../../utils/delFileFromCloudinary";
import { uploadFileToCloudinary } from "../../utils/fileUpload";
import paginate from "../../utils/paginate";


// Find a category by its ID
 export const findCategoryById = async (
  categoryId: string
): Promise<ICategory | null> => {
    return await Category.findById(categoryId);
  };
// Find a category by its  name
 export const findCategoryByName = async (
  category: string
): Promise<ICategory | null> => {
    return await Category.findOne({ name: {$regex:category,$options:'i'}});
  };
  
// Fetch all categories (public access)
 
export const getAllCategories = async (): Promise<ICategory[]> => {
      return await Category.find({});
};

 
// Fetch all categories for admin (admin access)
 
export const getAllCategoriesForAdmin = async (
    page: number,
    limit: number,
    query: object = {} 
  ): Promise<PaginationResult<ICategory>> => {
     console.log(query);
     
     return await paginate(Category, query, page, limit);

  };

 
// Create a new category (admin access)
 
export const createCategory = async (
    categoryData: Partial<ICategory>,
    file: Express.Multer.File
  ): Promise<ICategory> => {
 
      const result = await uploadFileToCloudinary(file); 
      const category = new Category({
        ...categoryData,
        image: result.secure_url,  
      });
      return await category.save();  
 
  };
  
 
// Update a category in the database with the provided updates
 
export const updateCategoryInDb = async (
    categoryId: string,
    updates: Partial<ICategory>
  ): Promise<ICategory | null> => {
    return await Category.findByIdAndUpdate(categoryId, updates, { new: true });
  };

 
// Upload the category image to Cloudinary and return the URL
 
export const uploadCategoryImage = async (image: Express.Multer.File): Promise<string> => {
    const result = await uploadFileToCloudinary(image);
    return result.secure_url;
  };

// Delete the category image from Cloudinary

export const deleteCategoryImage = async (imageUrl: string): Promise<void> => {
    await deleteFileFromCloudinary(imageUrl);
  };
  
    
// Delete a category from the database
    
  export const deleteCategoryFromDb = async (categoryId: string): Promise<void> => {
    await Category.deleteOne({ _id: categoryId });
  };