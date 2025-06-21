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
exports.toggleArchivedProduct = exports.toggleFeatureProduct = exports.trackProductClick = exports.trackProductView = exports.searchProductsService = exports.findProductById = exports.findArchivedProducts = exports.getVendorProducts = exports.getFeaturedProducts = exports.deleteProductInDb = exports.deleteProductImage = exports.updateProductInDb = exports.uploadProductImage = exports.addProduct = exports.findAllProducts = void 0;
const Product_1 = __importDefault(require("../../models/Product"));
const fileUpload_1 = require("../../utils/fileUpload");
const paginate_1 = __importDefault(require("../../utils/paginate"));
const delFileFromCloudinary_1 = require("../../utils/delFileFromCloudinary");
// Retrieve all products for public view
const findAllProducts = (page_1, limit_1, ...args_1) => __awaiter(void 0, [page_1, limit_1, ...args_1], void 0, function* (page, limit, query = {}, sort) {
    return (0, paginate_1.default)(Product_1.default, query, page, limit, sort, '-analytics -totalRevenue');
});
exports.findAllProducts = findAllProducts;
// Add a new product (vendors)
const addProduct = (productData, files, email) => __awaiter(void 0, void 0, void 0, function* () {
    const imageUrls = yield Promise.all(files.map(file => (0, exports.uploadProductImage)(file)));
    const product = new Product_1.default(Object.assign(Object.assign({}, productData), { vendorEmail: email, images: imageUrls }));
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
const updateProductInDb = (productId, updatedData, email) => __awaiter(void 0, void 0, void 0, function* () {
    return Product_1.default.findOneAndUpdate({ _id: productId, vendorEmail: email }, { $set: updatedData }, { new: true });
});
exports.updateProductInDb = updateProductInDb;
// Delete the product image from Cloudinary
const deleteProductImage = (imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, delFileFromCloudinary_1.deleteFileFromCloudinary)(imageUrl);
});
exports.deleteProductImage = deleteProductImage;
// Delete a product permanently(Only vendors are allowed to delete their own products)
const deleteProductInDb = (productId, email) => __awaiter(void 0, void 0, void 0, function* () {
    return Product_1.default.findOneAndDelete({
        _id: productId,
        vendorEmail: email,
    });
});
exports.deleteProductInDb = deleteProductInDb;
// Retrieve featured products
const getFeaturedProducts = (page, limit, sort) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {
        isFeatured: true,
        isArchived: false,
    };
    return (0, paginate_1.default)(Product_1.default, query, page, limit, sort, undefined, "category");
});
exports.getFeaturedProducts = getFeaturedProducts;
// Retrieve all products for a vendor
const getVendorProducts = (page_1, limit_1, ...args_1) => __awaiter(void 0, [page_1, limit_1, ...args_1], void 0, function* (page, limit, query = {}, sort) {
    return (0, paginate_1.default)(Product_1.default, query, page, limit, sort, undefined, "category");
});
exports.getVendorProducts = getVendorProducts;
// Retrieve archived products for a vendor
const findArchivedProducts = (page_1, limit_1, ...args_1) => __awaiter(void 0, [page_1, limit_1, ...args_1], void 0, function* (page, limit, query = {}, sort) {
    return (0, paginate_1.default)(Product_1.default, query, page, limit, sort);
});
exports.findArchivedProducts = findArchivedProducts;
// Fetch detailed information about a product by its ID
const findProductById = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    return Product_1.default.findById(productId).populate("category");
});
exports.findProductById = findProductById;
// Search products by name or description
const searchProductsService = (page_1, limit_1, ...args_1) => __awaiter(void 0, [page_1, limit_1, ...args_1], void 0, function* (page, limit, query = {}, sort) {
    return (0, paginate_1.default)(Product_1.default, query, page, limit, sort);
});
exports.searchProductsService = searchProductsService;
// Track when a product page is viewed
const trackProductView = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    return Product_1.default.findByIdAndUpdate(productId, { $inc: { 'analytics.views': 1 } }, { new: true });
});
exports.trackProductView = trackProductView;
// Track when a product page is clicked
const trackProductClick = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    return Product_1.default.findByIdAndUpdate(productId, { $inc: { 'analytics.clicks': 1 } }, { new: true });
});
exports.trackProductClick = trackProductClick;
// Mark a product as featured or remove it from the featured list
const toggleFeatureProduct = (productId, isFeatured, email) => __awaiter(void 0, void 0, void 0, function* () {
    return Product_1.default.findOneAndUpdate({ _id: productId, vendorEmail: email }, { $set: { isFeatured } }, { new: true });
});
exports.toggleFeatureProduct = toggleFeatureProduct;
// Mark a product as archived or remove it from the archived list
const toggleArchivedProduct = (productId, isArchived, email) => __awaiter(void 0, void 0, void 0, function* () {
    return Product_1.default.findOneAndUpdate({ _id: productId, vendorEmail: email }, { $set: { isArchived } }, { new: true });
});
exports.toggleArchivedProduct = toggleArchivedProduct;
