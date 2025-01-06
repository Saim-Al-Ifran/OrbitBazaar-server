import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../../middlewares/TryCatch";
import { findCategoryByName } from "../../services/category/category.services";
import CustomError from "../../utils/errors/customError";
import {
  addProduct,
  deleteProductImage,
  deleteProductInDb,
  findAllProducts,
  findProductById,
  getFeaturedProducts,
  getVendorProducts,
 
} from "../../services/product/product.services";
 

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

    // Sorting logic
    const sortOption = req.query.sort as string;
    const sortMapping: Record<string, string> = {
      "low-price": "price",
      "high-price": "-price",
      rating: "-ratings.average",
    };
    const sortField = sortMapping[sortOption] || "createdAt";

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

export const getAllProductsForVendor = TryCatch(
  async (req: Request, res: Response, _next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const vendorEmail = req.user?.email;

    const { search, sort } = req.query;

    // Build query
    const query: Record<string, any> = { isArchived: false };
    if (vendorEmail) {
      query.vendorEmail = vendorEmail; 
    }
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const sortMapping: Record<string, string> = {
      asc: "price",
      dsc: "-price",
    };
    const sortField = sortMapping[sort as string] || "-createdAt"; 
 
    const { data, totalRecords, totalPages, prevPage, nextPage } =
      await getVendorProducts(page, limit, query, sortField);

 
    if (data.length === 0) {
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

export const createProduct = TryCatch(
  async(req: Request,res: Response,_next: NextFunction)=>{
    const vendorEmail = req.user?.email;
    const productData  = req.body;
    const file = req.file; 

    if (!file) {
      throw new CustomError("Product image is required",400)
    }
    if (!vendorEmail) {
      throw new CustomError("Vendor email is required",400)
    }
    const newProduct = await addProduct(productData, file,vendorEmail);
 
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  }
)

export const getSingleProduct = TryCatch(
  async(req:Request,res:Response,_next:NextFunction)=>{
    const id = req.params.id;
    const product = await findProductById(id);
    if(!product){
      throw new CustomError('Product not found!',404);
    }
    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product,
   })
  }
)

export const getAllFeaturedProducts = TryCatch(
  async (req: Request, res: Response, _next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

  
    const { data, totalRecords, totalPages, prevPage, nextPage } =
      await getFeaturedProducts(page, limit);

 
    if (data.length === 0) {
      throw new CustomError("No featured products found!", 404);
    }

    // Return response
    res.status(200).json({
      success: true,
      message: "Featured products fetched successfully.",
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

export const deleteProduct = TryCatch(
  async(req:Request,res:Response,_next:NextFunction)=>{
      const { id } = req.params;
      const vendorEmail = req.user?.email;
      const product = await findProductById(id);
      if(!vendorEmail){
        throw new CustomError("Vendor can only delete their own product",401);
      }
      if (!product) {
        throw new CustomError('Product not found!', 404);
      }
      if(product.image){
        await deleteProductImage(product.image);
      }
      await  deleteProductInDb(id,vendorEmail);
      res.status(200).json({
        success: true,
        message: "Product deleted successfully.",
      });
  }
)
