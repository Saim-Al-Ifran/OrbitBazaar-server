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
exports.trackProductViewController = exports.toggleProductFeaturedStatus = exports.updatedProduct = exports.deleteProduct = exports.getAllFeaturedProducts = exports.getSingleProduct = exports.createProduct = exports.getAllProductsForVendor = exports.getAllProducts = void 0;
const TryCatch_1 = require("../../middlewares/TryCatch");
const category_services_1 = require("../../services/category/category.services");
const customError_1 = __importDefault(require("../../utils/errors/customError"));
const product_services_1 = require("../../services/product/product.services");
exports.getAllProducts = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    // Extract and prepare filtering options
    const { minPrice, maxPrice, category } = req.query;
    const query = { isArchived: false };
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice)
            query.price.$gte = parseFloat(minPrice);
        if (maxPrice)
            query.price.$lte = parseFloat(maxPrice);
    }
    if (category) {
        const categoryData = yield (0, category_services_1.findCategoryByName)(category);
        if (!categoryData) {
            throw new customError_1.default("Category not found", 404);
        }
        query.category = categoryData._id;
    }
    // Sorting logic
    const sortOption = req.query.sort;
    const sortMapping = {
        "low-price": "price",
        "high-price": "-price",
        rating: "-ratings.average",
    };
    const sortField = sortMapping[sortOption] || "createdAt";
    const { data, totalRecords, totalPages, prevPage, nextPage } = yield (0, product_services_1.findAllProducts)(page, limit, query, sortField);
    if (data.length === 0) {
        throw new customError_1.default('No product data found!', 404);
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
}));
exports.getAllProductsForVendor = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const vendorEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    const { search, sort } = req.query;
    // Build query
    const query = { isArchived: false };
    if (vendorEmail) {
        query.vendorEmail = vendorEmail;
    }
    if (search) {
        query.name = { $regex: search, $options: "i" };
    }
    const sortMapping = {
        asc: "price",
        dsc: "-price",
    };
    const sortField = sortMapping[sort] || "-createdAt";
    const { data, totalRecords, totalPages, prevPage, nextPage } = yield (0, product_services_1.getVendorProducts)(page, limit, query, sortField);
    if (data.length === 0) {
        throw new customError_1.default('No product data found!', 404);
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
}));
exports.createProduct = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const vendorEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    const productData = req.body;
    const file = req.file;
    console.log(req.body);
    if (!file) {
        throw new customError_1.default("Product image is required", 400);
    }
    if (!vendorEmail) {
        throw new customError_1.default("Vendor email is required", 400);
    }
    const newProduct = yield (0, product_services_1.addProduct)(productData, file, vendorEmail);
    res.status(201).json({
        success: true,
        message: "Product created successfully",
        product: newProduct,
    });
}));
exports.getSingleProduct = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const product = yield (0, product_services_1.findProductById)(id);
    if (!product) {
        throw new customError_1.default('Product not found!', 404);
    }
    res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        product,
    });
}));
exports.getAllFeaturedProducts = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { data, totalRecords, totalPages, prevPage, nextPage } = yield (0, product_services_1.getFeaturedProducts)(page, limit);
    if (data.length === 0) {
        throw new customError_1.default("No featured products found!", 404);
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
}));
exports.deleteProduct = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const vendorEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    const product = yield (0, product_services_1.findProductById)(id);
    if ((product === null || product === void 0 ? void 0 : product.vendorEmail) !== vendorEmail) {
        throw new customError_1.default("Vendor can only delete their own product", 401);
    }
    if (!vendorEmail) {
        throw new customError_1.default("Vendor email is required", 400);
    }
    if (!product) {
        throw new customError_1.default('Product not found!', 404);
    }
    if (product.image) {
        yield (0, product_services_1.deleteProductImage)(product.image);
    }
    yield (0, product_services_1.deleteProductInDb)(id, vendorEmail);
    res.status(200).json({
        success: true,
        message: "Product deleted successfully.",
    });
}));
exports.updatedProduct = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const updates = req.body;
    const file = req.file;
    const vendorEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    const product = yield (0, product_services_1.findProductById)(id);
    if (!vendorEmail) {
        throw new customError_1.default("Vendor email is required", 400);
    }
    if (!product) {
        throw new customError_1.default('Product not found!', 404);
    }
    if (file) {
        if (product.image) {
            yield (0, product_services_1.deleteProductImage)(product.image);
        }
        const newImageUrl = yield (0, product_services_1.uploadProductImage)(file);
        updates.imageUrl = newImageUrl;
    }
    const updatedProduct = yield (0, product_services_1.updateProductInDb)(id, updates, vendorEmail);
    if (!updatedProduct) {
        throw new customError_1.default("Vendor can only update their own product", 401);
    }
    res.status(200).json({
        success: true,
        message: "Product updated successfully.",
        data: updatedProduct,
    });
}));
exports.toggleProductFeaturedStatus = (0, TryCatch_1.TryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const productId = req.params.id;
    const isFeatured = req.body.isFeatured;
    const vendorEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!vendorEmail) {
        throw new customError_1.default("Vendor email is required", 400);
    }
    if (typeof isFeatured !== "boolean") {
        throw new customError_1.default("Invalid value for 'isFeatured'. It must be a boolean.", 400);
    }
    const updatedProduct = yield (0, product_services_1.toggleFeatureProduct)(productId, isFeatured, vendorEmail);
    if (!updatedProduct) {
        throw new customError_1.default("Product not found or you do not have permission to update it.", 404);
    }
    res.status(200).json({
        success: true,
        message: `Product '${updatedProduct.name}' ${isFeatured ? "featured" : "unfeatured"} successfully.`,
        data: updatedProduct,
    });
}));
exports.trackProductViewController = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        throw new customError_1.default("Product ID is required", 400);
    }
    const updatedProduct = yield (0, product_services_1.trackProductView)(id);
    if (!updatedProduct) {
        throw new customError_1.default("Product not found", 404);
    }
    res.status(200).json({
        success: true,
        message: "Product view tracked successfully.",
        data: updatedProduct,
    });
}));
