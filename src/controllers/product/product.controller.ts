import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../../middlewares/TryCatch";
import { findCategoryByName } from "../../services/category/category.services";
import CustomError from "../../utils/errors/customError";
import { findAllProducts } from "../../services/product/product.services";
import Product from "../../models/Product";

export const getAllProducts = TryCatch(
  async (req: Request, res: Response, _next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Extract and prepare filtering options
    const { minPrice, maxPrice, category } = req.query;

    
    const query: Record<string, any> = { isArchived: false };

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice as string);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice as string);
    }

    if (category) {
      const categoryData = await findCategoryByName(category as string);
    
      if (!categoryData) {
        throw new CustomError("Category not found", 404);
      }
      query.category = categoryData._id;
    }
    console.log(query);
    // Sorting logic
    const sortOption = req.query.sort as string;
    const sortMapping: Record<string, string> = {
      "low-price": "price",
      "high-price": "-price",
      rating: "-ratings.average",
    };
    const sortField = sortMapping[sortOption] || "createdAt";
     
    console.log(sortField);
    
    const { data, totalRecords, totalPages, prevPage, nextPage } = await findAllProducts(
      page,
      limit,
      query,
      sortField
    );

    if(data.length === 0){
        throw new CustomError('No product data found!',404);
   }
    
    res.status(200).json({
      success: true,
      message: "All products fetched successfully.",
      data,
      pagination: {
        totalRecords,
        totalPages,
        prevPage,
        nextPage,
        currentPage: page,
      },
    });
  }
);
