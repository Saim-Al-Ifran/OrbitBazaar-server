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
  files: Express.Multer.File[],
  email: string
): Promise<IProduct> => {
  const imageUrls = await Promise.all(files.map(file => uploadProductImage(file)));
 
  const product = new Product({
    ...productData,
    vendorEmail: email,
    images: imageUrls, 
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
  export const updateProductInDb = async (
    productId: string,
    updatedData: Partial<IProduct>,
    email: string
  ): Promise<IProduct | null> => {
    return Product.findOneAndUpdate(
      { _id: productId, vendorEmail:email } ,
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
  export const deleteProductInDb= async (
      productId: string,
      email: string
    ): Promise<IProduct | null> => {
 
      return Product.findOneAndDelete({
        _id: productId,
        vendorEmail:email,
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
    query: object = {} ,
    sort: Record<string, 1 | -1>
): Promise<PaginationResult<IProduct> > => {
       return paginate(Product, query, page, limit, sort, undefined, "category");
  };

// Retrieve archived products for a vendor
export const findArchivedProducts = async (
    page:number,
    limit:number,
    query: object = {},
    sort:string 
): Promise<PaginationResult<IProduct> > => {
      return paginate(Product,query,page,limit,sort);
  };
  
// Fetch detailed information about a product by its ID
export const findProductById = async (
    productId: string
): Promise<IProduct | null> => {
    return Product.findById(productId).populate("category");
  };

// Search products by name or description
export const searchProductsService = async (
    page:number,
    limit:number,
    query: object = {},
    sort:string
):Promise<PaginationResult<IProduct> > => {
    return paginate(Product,query,page,limit,sort);
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
// Track when a product page is clicked
export const trackProductClick = async (
    productId: string
): Promise<IProduct | null> => {
    return Product.findByIdAndUpdate(
      productId,
      { $inc: { 'analytics.clicks': 1 } },
      { new: true }
    );
  };

// Mark a product as featured or remove it from the featured list
export const toggleFeatureProduct = async (
    productId: string,
    isFeatured: boolean,
    email: string
  ): Promise<IProduct | null> => {
    return Product.findOneAndUpdate(
      { _id: productId, vendorEmail:email },
      { $set: { isFeatured }} ,
      { new: true }
    );
  };
  
// Mark a product as archived or remove it from the archived list
export const toggleArchivedProduct = async (
    productId: string,
    isArchived: boolean,
    email: string
  ): Promise<IProduct | null> => {
    return Product.findOneAndUpdate(
      { _id: productId, vendorEmail:email },
      { $set: { isArchived }} ,
      { new: true }
    );
  };

 