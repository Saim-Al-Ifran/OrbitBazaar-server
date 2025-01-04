"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleFeatureProduct = exports.trackProductView = exports.searchProducts = exports.getProductById = exports.getArchivedProducts = exports.getVendorProducts = exports.getFeaturedProducts = exports.deleteProduct = exports.deleteProductImage = exports.updateProduct = exports.uploadProductImage = exports.addProduct = exports.getAllProducts = void 0;
const Product_1 = __importDefault(require("../../models/Product"));
const fileUpload_1 = require("../../utils/fileUpload");
const paginate_1 = __importDefault(require("../../utils/paginate"));
const delFileFromCloudinary_1 = require("../../utils/delFileFromCloudinary");
// Retrieve all products for public view
const getAllProducts = (page, limit, sort) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {
        isArchived: false
    };
    const sortObject = sort ? { [sort]: 1 } : {};
    return (0, paginate_1.default)(Product_1.default, query, page, limit, sortObject, '-analytics');
});
exports.getAllProducts = getAllProducts;
// Add a new product (vendors)
const addProduct = (productData, file) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, fileUpload_1.uploadFileToCloudinary)(file);
    const product = new Product_1.default(Object.assign(Object.assign({}, productData), { image: result.secure_url }));
    return yield product.save();
});
exports.addProduct = addProduct;
// Upload the product image to Cloudinary and return the URL
const uploadProductImage = (image) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, fileUpload_1.uploadFileToCloudinary)(image);
    return result.secure_url;
});
exports.uploadProductImage = uploadProductImage;
// Update product details by product ID (vendors)
const updateProduct = (productId, updatedData, vendorEmail) => __awaiter(void 0, void 0, void 0, function* () {
    return Product_1.default.findOneAndUpdate({ _id: productId, vendorEmail }, { $set: updatedData }, { new: true });
});
exports.updateProduct = updateProduct;
// Delete the product image from Cloudinary
const deleteProductImage = (imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, delFileFromCloudinary_1.deleteFileFromCloudinary)(imageUrl);
});
exports.deleteProductImage = deleteProductImage;
// Delete a product permanently(Only vendors are allowed to delete their own products)
const deleteProduct = (productId, vendorEmail) => __awaiter(void 0, void 0, void 0, function* () {
    return Product_1.default.findOneAndDelete({
        _id: productId,
        vendorEmail,
    });
});
exports.deleteProduct = deleteProduct;
// Retrieve featured products
const getFeaturedProducts = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {
        isFeatured: true,
        isArchived: false,
    };
    return (0, paginate_1.default)(Product_1.default, query, page, limit);
});
exports.getFeaturedProducts = getFeaturedProducts;
// Retrieve all products for a vendor
const getVendorProducts = (page_1, limit_1, ...args_1) => __awaiter(void 0, [page_1, limit_1, ...args_1], void 0, function* (page, limit, query = {}) {
    return (0, paginate_1.default)(Product_1.default, query, page, limit);
});
exports.getVendorProducts = getVendorProducts;
// Retrieve archived products for a vendor
const getArchivedProducts = (page_1, limit_1, ...args_1) => __awaiter(void 0, [page_1, limit_1, ...args_1], void 0, function* (page, limit, query = {}) {
    return (0, paginate_1.default)(Product_1.default, query, page, limit);
});
exports.getArchivedProducts = getArchivedProducts;
// Fetch detailed information about a product by its ID
const getProductById = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    return Product_1.default.findById(productId);
});
exports.getProductById = getProductById;
// Search products by name or description
const searchProducts = (keyword) => __awaiter(void 0, void 0, void 0, function* () {
    const regex = new RegExp(keyword, 'i');
    return Product_1.default.find({
        $or: [{ name: regex }, { description: regex }],
        isArchived: false,
    });
});
exports.searchProducts = searchProducts;
// Track when a product page is viewed
const trackProductView = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    return Product_1.default.findByIdAndUpdate(productId, { $inc: { 'analytics.views': 1 } }, { new: true });
});
exports.trackProductView = trackProductView;
// Mark a product as featured or remove it from the featured list
const toggleFeatureProduct = (productId, isFeatured, vendorEmail) => __awaiter(void 0, void 0, void 0, function* () {
    return Product_1.default.findOneAndUpdate({ _id: productId, vendorEmail }, { $set: { isFeatured } }, { new: true });
});
exports.toggleFeatureProduct = toggleFeatureProduct;
