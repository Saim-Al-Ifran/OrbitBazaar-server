import Product from "../../models/Product";
import { IProduct } from "../../types/models/Product";
import { uploadFileToCloudinary } from "../../utils/fileUpload";
import paginate from "../../utils/paginate";
import { PaginationResult } from "../../types/types";
import { deleteFileFromCloudinary } from "../../utils/delFileFromCloudinary";

 
// Retrieve all products for public view
export const findAllProducts = async (
    page:number,
    limit:number,
    query:any={},
    sort: string,
) : Promise<PaginationResult<IProduct>> => {
 
   
    return paginate(Product,query,page,limit,sort,'-analytics -totalRevenue')
      
  };

// Add a new product (vendors)
  export const addProduct = async (
    productData: Partial<IProduct>,
    file: Express.Multer.File
  ): Promise<IProduct> => {
 
      const result = await uploadFileToCloudinary(file); 
      const product = new Product({
        ...productData,
        image: result.secure_url,  
      });
      return await product.save();  
 
  };

// Upload the product image to Cloudinary and return the URL
  export const uploadProductImage = async (
    image: Express.Multer.File
  ): Promise<string> => {
    const result = await uploadFileToCloudinary(image);
    return result.secure_url;
  };

// Update product details by product ID (vendors)
  export const updateProduct = async (
    productId: string,
    updatedData: Partial<IProduct>,
    vendorEmail: string
  ): Promise<IProduct | null> => {
    return Product.findOneAndUpdate(
      { _id: productId, vendorEmail } ,
      { $set: updatedData } ,
      { new: true }
    );
  };
// Delete the product image from Cloudinary
  export const deleteProductImage = async (
    imageUrl: string
  ): Promise<void> => {
      await deleteFileFromCloudinary(imageUrl);
    };
    
// Delete a product permanently(Only vendors are allowed to delete their own products)
  export const deleteProduct = async (
      productId: string,
      vendorEmail: string
    ): Promise<IProduct | null> => {
 
      return Product.findOneAndDelete({
        _id: productId,
        vendorEmail,
      });
    };
    

// Retrieve featured products
export const getFeaturedProducts = async (
    page: number,
    limit: number
  ): Promise<PaginationResult<IProduct>> => {
    const query = {
      isFeatured: true,
      isArchived: false,
    };
  
    return paginate(Product, query, page, limit );
  };
 
// Retrieve all products for a vendor
export const getVendorProducts = async (
    page:number,
    limit:number,
    query: object = {} 
): Promise<PaginationResult<IProduct> > => {
      return paginate(Product,query,page,limit);
  };

// Retrieve archived products for a vendor
export const getArchivedProducts = async (
    page:number,
    limit:number,
    query: object = {} 
): Promise<PaginationResult<IProduct> > => {
      return paginate(Product,query,page,limit);
  };
  
// Fetch detailed information about a product by its ID
export const getProductById = async (
    productId: string
): Promise<IProduct | null> => {
    return Product.findById(productId);
  };

// Search products by name or description
export const searchProducts = async (
    keyword: string
): Promise<IProduct[]> => {
    const regex = new RegExp(keyword, 'i'); 
    return Product.find({
      $or: [{ name: regex }, { description: regex }],
      isArchived: false,
    });
  };

// Track when a product page is viewed
export const trackProductView = async (
    productId: string
): Promise<IProduct | null> => {
    return Product.findByIdAndUpdate(
      productId,
      { $inc: { 'analytics.views': 1 } },
      { new: true }
    );
  };

// Mark a product as featured or remove it from the featured list
export const toggleFeatureProduct = async (
    productId: string,
    isFeatured: boolean,
    vendorEmail: string
  ): Promise<IProduct | null> => {
    return Product.findOneAndUpdate(
      { _id: productId, vendorEmail },
      { $set: { isFeatured }} ,
      { new: true }
    );
  };