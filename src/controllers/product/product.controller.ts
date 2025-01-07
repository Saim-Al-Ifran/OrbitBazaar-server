import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../../middlewares/TryCatch";
import { findCategoryByName } from "../../services/category/category.services";
import CustomError from "../../utils/errors/customError";
import {
  addProduct,
  deleteProductImage,
  deleteProductInDb,
  findAllProducts,
  findArchivedProducts,
  findProductById,
  getFeaturedProducts,
  getVendorProducts,
  toggleFeatureProduct,
  trackProductClick,
  trackProductView,
  updateProductInDb,
  uploadProductImage,
 
} from "../../services/product/product.services";
import { updateUserProfileImage } from "../user/user.controller";
 

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
      if(product?.vendorEmail !== vendorEmail){
        throw new CustomError("Vendor can only delete their own product",401);
      }
      if(!vendorEmail){
        throw new CustomError("Vendor email is required",400)
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

export const updatedProduct = TryCatch(
  async(req:Request,res:Response,_next:NextFunction)=>{
      const { id } = req.params;
      const updates = req.body;
      const file = req.file;
      const vendorEmail = req.user?.email;
      const product = await findProductById(id);

      if(!vendorEmail){
        throw new CustomError("Vendor email is required",400)
      }
      if(!product){
        throw new CustomError('Product not found!', 404);
      }

      if (file) {
        if(product.image){
          await deleteProductImage(product.image);
        }
        const newImageUrl= await uploadProductImage(file);
        updates.imageUrl = newImageUrl;
      }

      const updatedProduct = await updateProductInDb(id,updates,vendorEmail);
      if(!updatedProduct){
         throw new CustomError("Vendor can only update their own product",401);
      }
      res.status(200).json({
        success: true,
        message: "Product updated successfully.",
        data: updatedProduct,
      });
  }
)


export const toggleProductFeaturedStatus = TryCatch(
  async (req: Request, res: Response) => {
    const productId = req.params.id;
    const isFeatured = req.body.isFeatured;
    const vendorEmail = req.user?.email;
 
    if (!vendorEmail) {
      throw new CustomError("Vendor email is required",400);
    }
 
    if (typeof isFeatured !== "boolean") {
      throw new CustomError("Invalid value for 'isFeatured'. It must be a boolean.", 400);
    }
 
    const updatedProduct = await toggleFeatureProduct(productId, isFeatured, vendorEmail);
 
    if (!updatedProduct) {
      throw new CustomError("Product not found or you do not have permission to update it.", 404);
    }

    res.status(200).json({
      success: true,
      message: `Product '${updatedProduct.name}' ${isFeatured ? "featured" : "unfeatured"} successfully.`,
      data: updatedProduct,
    });
  }
);


export const trackProductViewController = TryCatch(
  async (req: Request, res: Response, _next: NextFunction) => {

    const { id } = req.params;
    if (!id) {
      throw new CustomError("Product ID is required", 400);
    }
    const updatedProduct = await trackProductView(id);
    if (!updatedProduct) {
      throw new CustomError("Product not found", 404);
    }
 
    res.status(200).json({
      success: true,
      message: "Product view tracked successfully.",
      data: updatedProduct,
    });
    
  }
);
export const trackProductClickController = TryCatch(
  async (req: Request, res: Response, _next: NextFunction) => {

    const { id } = req.params;
    if (!id) {
      throw new CustomError("Product ID is required", 400);
    }
    const updatedProduct = await trackProductClick(id);
    if (!updatedProduct) {
      throw new CustomError("Product not found", 404);
    }
 
    res.status(200).json({
      success: true,
      message: "Product click tracked successfully.",
      data: updatedProduct,
    });
    
  }
);

export const getArchivedProducts = TryCatch(
  async (req: Request, res: Response, _next: NextFunction) => {
    // Parse query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = req.query.sort as string;
    const email = req.user?.email;
     
    const query: Record<string, any> = {
      isArchived: true,
      vendorEmail:email
    };

  
    const sortMapping: Record<string, string> = {
      createdAsc: "createdAt", 
      createdDsc: "-createdAt", 
    };

    const sortField = sortMapping[sort] || "-createdAt";  
    const {
      data,
      totalRecords,
      totalPages,
      prevPage,
      nextPage,
    } = await findArchivedProducts(page, limit, query, sortField);

    // Check if data exists
    if (data.length === 0) {
      throw new CustomError("No archived products found!", 404);
    }

    // Send response
    res.status(200).json({
      success: true,
      message: "Archived products fetched successfully.",
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
