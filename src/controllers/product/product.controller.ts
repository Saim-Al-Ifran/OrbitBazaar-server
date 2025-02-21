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
  searchProductsService,
  toggleArchivedProduct,
  toggleFeatureProduct,
  trackProductClick,
  trackProductView,
  updateProductInDb,
  uploadProductImage,
 
} from "../../services/product/product.services";
import { deleteCacheByPattern, getCache, setCache } from "../../utils/cache";

 
export const getAllProducts = TryCatch(
  async (req: Request, res: Response, _next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { minPrice, maxPrice, category, sort } = req.query;

    // Create a cache key based on query params
    const cacheKey = `products:page=${page}&limit=${limit}&minPrice=${minPrice}&maxPrice=${maxPrice}&category=${category}&sort=${sort}`;

    // Check cache first
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Extract and prepare filtering options
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
    const sortMapping: Record<string, string> = {
      "low-price": "price",
      "high-price": "-price",
      rating: "-ratings.average",
    };
    const sortField = sortMapping[sort as string] || "createdAt";

    // Fetch data from DB
    const { data, totalRecords, totalPages, prevPage, nextPage } = await findAllProducts(
      page,
      limit,
      query,
      sortField
    );

    if (data.length === 0) {
      throw new CustomError("No product data found!", 404);
    }

    const response = {
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
    };

    // Store result in cache
    await setCache(cacheKey, response, 120);

    res.status(200).json(response);
  }
);

// export const getAllProductsForVendor = TryCatch(
//   async (req: Request, res: Response, _next: NextFunction) => {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const vendorEmail = req.user?.email;

//     const { search, sort } = req.query;

//     // Build query
//     const query: Record<string, any> = { isArchived: false };
//     if (vendorEmail) {
//       query.vendorEmail = vendorEmail; 
//     }
//     if (search) {
//       query.name = { $regex: search, $options: "i" };
//     }

//     const sortMapping: Record<string, string> = {
//       asc: "price",
//       dsc: "-price",
//     };
//     const sortField = sortMapping[sort as string] || "-createdAt"; 
 
//     const { data, totalRecords, totalPages, prevPage, nextPage } =
//       await getVendorProducts(page, limit, query, sortField);

 
//     if (data.length === 0) {
//       throw new CustomError('No product data found!',404);
//     }
    
//     res.status(200).json({
//       success: true,
//       message: "All products fetched successfully.",
//       data,
//       pagination: {
//         totalRecords,
//         totalPages,
//         prevPage,
//         nextPage,
//         currentPage: page,
//       },
//     });
//   }
// );

export const getAllProductsForVendor = TryCatch(
  async (req: Request, res: Response, _next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const vendorEmail = req.user?.email;

    if (!vendorEmail) {
      throw new CustomError("Unauthorized access. Vendor email missing.", 403);
    }

    const { search, sort } = req.query;

    // Generate cache key
    const cacheKey = `vendor_products:${vendorEmail}:search=${search || ""}:page=${page}:limit=${limit}:sort=${sort || "createdAt"}`;

    // Check Redis cache first
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Build query
    const query: Record<string, any> = { isArchived: false, vendorEmail };
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const sortMapping: Record<string, string> = {
      asc: "price",
      dsc: "-price",
    };
    const sortField = sortMapping[sort as string] || "-createdAt";

    // Fetch data from database
    const { data, totalRecords, totalPages, prevPage, nextPage } =
      await getVendorProducts(page, limit, query, sortField);

    if (data.length === 0) {
      throw new CustomError("No product data found!", 404);
    }

    // Create response object
    const response = {
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
    };

    // Store response in Redis cache
    await setCache(cacheKey, response, 120);

    res.status(200).json(response);
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
    await deleteCacheByPattern(`vendor_products:${vendorEmail}*`);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  }
)

export const getSingleProduct = TryCatch(
  async (req: Request, res: Response, _next: NextFunction) => {
    const id = req.params.id;
    const cacheKey = `product:${id}`;

    const cachedProduct = await getCache(cacheKey);
    if (cachedProduct) {
      return res.status(200).json(JSON.parse(cachedProduct));
    }
 
    const product = await findProductById(id);
    if (!product) {
      throw new CustomError("Product not found!", 404);
    }

    const response = {
      success: true,
      message: "Product fetched successfully",
      product,
    };

    await setCache(cacheKey, response, 120);

    res.status(200).json(response);
  }
);
 
export const getAllFeaturedProducts = TryCatch(
  async (req: Request, res: Response, _next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const cacheKey = `featured_products:page=${page}:limit=${limit}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    const { data, totalRecords, totalPages, prevPage, nextPage } =
      await getFeaturedProducts(page, limit);

    if (data.length === 0) {
      throw new CustomError("No featured products found!", 404);
    }

    const response = {
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
    };

    // Store response in cache
    await setCache(cacheKey, response, 120);

    res.status(200).json(response);
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
      await deleteCacheByPattern(`vendor_products:${vendorEmail}*`);
      await deleteCacheByPattern(`products*`);
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
      await deleteCacheByPattern(`vendor_products:${vendorEmail}*`);
      await deleteCacheByPattern(`products*`);
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
    await deleteCacheByPattern(`vendor_products:${vendorEmail}*`);
    await deleteCacheByPattern(`products*`);
    res.status(200).json({
      success: true,
      message: `Product '${updatedProduct.name}' ${isFeatured ? "featured" : "unfeatured"} successfully.`,
      data: updatedProduct,
    });
  }
);
export const toggleProductArchivedStatus = TryCatch(
  async (req: Request, res: Response) => {
    const productId = req.params.id;
    const isArchived= req.body.isArchived;
    const vendorEmail = req.user?.email;
 
    if (!vendorEmail) {
      throw new CustomError("Vendor email is required",400);
    }
 
    if (typeof isArchived!== "boolean") {
      throw new CustomError("Invalid value for 'isFeatured'. It must be a boolean.", 400);
    }
 
    const updatedProduct = await toggleArchivedProduct(productId, isArchived, vendorEmail);
 
    if (!updatedProduct) {
      throw new CustomError("Product not found or you do not have permission to update it.", 404);
    }
    await deleteCacheByPattern(`vendor_products:${vendorEmail}*`);
    await deleteCacheByPattern(`products*`);
    res.status(200).json({
      success: true,
      message: `Product '${updatedProduct.name}' ${isArchived ? "Archived" : "unArchived"} successfully.`,
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
    const vendorEmail = req.user?.email;

    if (!vendorEmail) {
      throw new CustomError("Unauthorized access. Vendor email missing.", 403);
    }

    // Generate a unique cache key
    const cacheKey = `vendor_products:${vendorEmail}_archived_products:${vendorEmail}:page=${page}:limit=${limit}:sort=${sort || "createdDsc"}`;

    // Check Redis cache first
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Query to find archived products
    const query: Record<string, any> = {
      isArchived: true,
      vendorEmail: vendorEmail,
    };

    const sortMapping: Record<string, string> = {
      createdAsc: "createdAt",
      createdDsc: "-createdAt",
    };

    const sortField = sortMapping[sort] || "-createdAt";

    // Fetch data from database
    const { data, totalRecords, totalPages, prevPage, nextPage } =
      await findArchivedProducts(page, limit, query, sortField);

    // Check if data exists
    if (data.length === 0) {
      throw new CustomError("No archived products found!", 404);
    }

    // Create response object
    const response = {
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
    };

    // Store response in Redis cache
    await setCache(cacheKey, response, 120);

    // Send response
    res.status(200).json(response);
  }
);

export const searchProducts = TryCatch(
  async (req: Request, res: Response, _next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.keyword as string || "";
    const sort = req.query.sort as string || "createdDsc";

    // Generate cache key based on search and pagination
    const cacheKey = `search_products:keyword=${search}:page=${page}:limit=${limit}:sort=${sort}`;

    // Check if the data is already cached
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Build query
    const query: Record<string, any> = { isArchived: false };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },  
        { description: { $regex: search, $options: "i" } },   
      ];
    }

    // Sorting logic
    const sortMapping: Record<string, string> = {
      asc: "price",     
      dsc: "-price",       
      createdAsc: "createdAt", 
      createdDsc: "-createdAt",  
    };
    const sortField = sortMapping[sort] || "-createdAt"; 

    // Fetch products from the database
    const { data, totalRecords, totalPages, prevPage, nextPage } =
      await searchProductsService(page, limit, query, sortField);

    if (data.length === 0) {
      throw new CustomError("No product data found!", 404);
    }

    // Response object
    const response = {
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
    };

    // Store the response in Redis cache
    await setCache(cacheKey, response, 120);

    res.status(200).json(response);
  }
);


export const getVendorProductDetails = TryCatch(
  async (req: Request, res: Response, _next: NextFunction) => {
    const vendorEmail = req.user?.email;
    const productId = req.params.id;

    if (!vendorEmail) {
      throw new CustomError("Vendor authentication failed", 401);
    }

    // **Check Redis Cache**
    const cacheKey = `vendor_products:${vendorEmail}:product:${productId}`;
    const cachedProduct = await getCache(cacheKey);

    if (cachedProduct) {
      return res.status(200).json({
        success: true,
        message: "Product details fetched successfully (from cache).",
        product: JSON.parse(cachedProduct),
      });
    }

   
    const product = await findProductById(productId);
    if (!product) {
      throw new CustomError("Product not found!", 404);
    }
    if (product.vendorEmail !== vendorEmail) {
      throw new CustomError("You are not authorized to view this product", 403);
    }
 
    await setCache(cacheKey, product, 120);

    res.status(200).json({
      success: true,
      message: "Product details fetched successfully.",
      product,
    });
  }
);