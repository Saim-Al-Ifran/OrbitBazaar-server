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
exports.getVendorProductDetails = exports.searchProducts = exports.getArchivedProducts = exports.trackProductClickController = exports.trackProductViewController = exports.toggleProductArchivedStatus = exports.toggleProductFeaturedStatus = exports.updatedProduct = exports.deleteProduct = exports.getAllFeaturedProducts = exports.getSingleProduct = exports.createProduct = exports.getAllProductsForVendor = exports.getAllProducts = void 0;
const TryCatch_1 = require("../../middlewares/TryCatch");
const category_services_1 = require("../../services/category/category.services");
const customError_1 = __importDefault(require("../../utils/errors/customError"));
const product_services_1 = require("../../services/product/product.services");
const cache_1 = require("../../utils/cache");
exports.getAllProducts = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { minPrice, maxPrice, category, sort } = req.query;
    // Create a cache key based on query params
    const cacheKey = `products:page=${page}&limit=${limit}&minPrice=${minPrice}&maxPrice=${maxPrice}&category=${category}&sort=${sort}`;
    // Check cache first
    const cachedData = yield (0, cache_1.getCache)(cacheKey);
    if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
    }
    // Extract and prepare filtering options
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
    const sortMapping = {
        "low-price": "price",
        "high-price": "-price",
        rating: "-ratings.average",
    };
    const sortField = sortMapping[sort] || "createdAt";
    // Fetch data from DB
    const { data, totalRecords, totalPages, prevPage, nextPage } = yield (0, product_services_1.findAllProducts)(page, limit, query, sortField);
    if (data.length === 0) {
        throw new customError_1.default("No product data found!", 404);
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
    yield (0, cache_1.setCache)(cacheKey, response, 120);
    res.status(200).json(response);
}));
exports.getAllProductsForVendor = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const vendorEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!vendorEmail) {
        throw new customError_1.default("Unauthorized access. Vendor email missing.", 403);
    }
    const { search, sort } = req.query;
    // Generate cache key
    const cacheKey = `vendor_products:${vendorEmail}:search=${search || ""}:page=${page}:limit=${limit}:sort=${sort || "createdAt"}`;
    // Check Redis cache first
    const cachedData = yield (0, cache_1.getCache)(cacheKey);
    if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
    }
    // Build query
    const query = { isArchived: false, vendorEmail };
    if (search) {
        query.name = { $regex: search, $options: "i" };
    }
    // Sorting logic
    const sortParam = req.query.sort || "createdAt:desc";
    const [field, order] = sortParam.split(":");
    const sortOption = {
        [field]: order === "asc" ? 1 : -1,
    };
    // Fetch data from database
    const { data, totalRecords, totalPages, prevPage, nextPage } = yield (0, product_services_1.getVendorProducts)(page, limit, query, sortOption);
    if (data.length === 0) {
        const noDataMessage = search
            ? "No products matched your search!"
            : "No products found!";
        return res.status(200).json({
            success: true,
            message: noDataMessage,
            data: [],
        });
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
    yield (0, cache_1.setCache)(cacheKey, response, 120);
    res.status(200).json(response);
}));
exports.createProduct = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const vendorEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    const productData = req.body;
    const files = req.files;
    if (!files || files.length === 0) {
        throw new customError_1.default("At least one product image is required", 400);
    }
    if (!vendorEmail) {
        throw new customError_1.default("Vendor email is required", 400);
    }
    const newProduct = yield (0, product_services_1.addProduct)(productData, files, vendorEmail);
    yield (0, cache_1.deleteCacheByPattern)(`vendor_products:${vendorEmail}*`);
    res.status(201).json({
        success: true,
        message: "Product created successfully",
        product: newProduct,
    });
}));
exports.getSingleProduct = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const cacheKey = `product:${id}`;
    const cachedProduct = yield (0, cache_1.getCache)(cacheKey);
    if (cachedProduct) {
        return res.status(200).json(JSON.parse(cachedProduct));
    }
    const product = yield (0, product_services_1.findProductById)(id);
    if (!product) {
        throw new customError_1.default("Product not found!", 404);
    }
    const response = {
        success: true,
        message: "Product fetched successfully",
        product,
    };
    yield (0, cache_1.setCache)(cacheKey, response, 120);
    res.status(200).json(response);
}));
exports.getAllFeaturedProducts = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const cacheKey = `featured_products:page=${page}:limit=${limit}`;
    const cachedData = yield (0, cache_1.getCache)(cacheKey);
    if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
    }
    const { data, totalRecords, totalPages, prevPage, nextPage } = yield (0, product_services_1.getFeaturedProducts)(page, limit);
    if (data.length === 0) {
        throw new customError_1.default("No featured products found!", 404);
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
    yield (0, cache_1.setCache)(cacheKey, response, 120);
    res.status(200).json(response);
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
    if (product.images && Array.isArray(product.images)) {
        yield Promise.all(product.images.map((imgUrl) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, product_services_1.deleteProductImage)(imgUrl); })));
    }
    yield (0, product_services_1.deleteProductInDb)(id, vendorEmail);
    yield (0, cache_1.deleteCacheByPattern)(`vendor_products:${vendorEmail}*`);
    yield (0, cache_1.deleteCacheByPattern)(`products*`);
    res.status(200).json({
        success: true,
        message: "Product deleted successfully.",
    });
}));
exports.updatedProduct = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const updates = req.body;
    const files = req.files;
    const vendorEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    const product = yield (0, product_services_1.findProductById)(id);
    if (!vendorEmail) {
        throw new customError_1.default("Vendor email is required", 400);
    }
    if (!product) {
        throw new customError_1.default("Product not found!", 404);
    }
    // Sanity check: Don't allow blank string
    if (typeof updates.images === "string" && updates.images.trim() === "") {
        throw new customError_1.default("Images field cannot be an empty string", 400);
    }
    // Convert single existingImages string to array if needed
    let existingImages = [];
    if (updates.existingImages) {
        if (typeof updates.existingImages === "string") {
            existingImages = [updates.existingImages];
        }
        else if (Array.isArray(updates.existingImages)) {
            existingImages = updates.existingImages;
        }
    }
    // Upload new images
    let newUploadedUrls = [];
    if (files && files.length > 0) {
        newUploadedUrls = yield Promise.all(files.map(file => (0, product_services_1.uploadProductImage)(file)));
    }
    // Final combined image array
    updates.images = [...existingImages, ...newUploadedUrls];
    // Optional: delete removed old images that are not in existingImages anymore
    const removedImages = (product.images || []).filter(img => !existingImages.includes(img));
    yield Promise.all(removedImages.map(img => (0, product_services_1.deleteProductImage)(img)));
    const updatedProduct = yield (0, product_services_1.updateProductInDb)(id, updates, vendorEmail);
    if (!updatedProduct) {
        throw new customError_1.default("Vendor can only update their own product", 401);
    }
    yield (0, cache_1.deleteCacheByPattern)(`vendor_products:${vendorEmail}*`);
    yield (0, cache_1.deleteCacheByPattern)(`product*`);
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
    yield (0, cache_1.deleteCacheByPattern)(`vendor_products:${vendorEmail}*`);
    yield (0, cache_1.deleteCacheByPattern)(`products*`);
    res.status(200).json({
        success: true,
        message: `Product '${updatedProduct.name}' ${isFeatured ? "featured" : "unfeatured"} successfully.`,
        data: updatedProduct,
    });
}));
exports.toggleProductArchivedStatus = (0, TryCatch_1.TryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const productId = req.params.id;
    const isArchived = req.body.isArchived;
    const vendorEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!vendorEmail) {
        throw new customError_1.default("Vendor email is required", 400);
    }
    if (typeof isArchived !== "boolean") {
        throw new customError_1.default("Invalid value for 'isFeatured'. It must be a boolean.", 400);
    }
    const updatedProduct = yield (0, product_services_1.toggleArchivedProduct)(productId, isArchived, vendorEmail);
    if (!updatedProduct) {
        throw new customError_1.default("Product not found or you do not have permission to update it.", 404);
    }
    yield (0, cache_1.deleteCacheByPattern)(`vendor_products:${vendorEmail}*`);
    yield (0, cache_1.deleteCacheByPattern)(`products*`);
    res.status(200).json({
        success: true,
        message: `Product '${updatedProduct.name}' ${isArchived ? "Archived" : "unArchived"} successfully.`,
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
exports.trackProductClickController = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        throw new customError_1.default("Product ID is required", 400);
    }
    const updatedProduct = yield (0, product_services_1.trackProductClick)(id);
    if (!updatedProduct) {
        throw new customError_1.default("Product not found", 404);
    }
    res.status(200).json({
        success: true,
        message: "Product click tracked successfully.",
        data: updatedProduct,
    });
}));
exports.getArchivedProducts = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort;
    const vendorEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!vendorEmail) {
        throw new customError_1.default("Unauthorized access. Vendor email missing.", 403);
    }
    // Generate a unique cache key
    const cacheKey = `vendor_products:${vendorEmail}_archived_products:${vendorEmail}:page=${page}:limit=${limit}:sort=${sort || "createdDsc"}`;
    // Check Redis cache first
    const cachedData = yield (0, cache_1.getCache)(cacheKey);
    if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
    }
    // Query to find archived products
    const query = {
        isArchived: true,
        vendorEmail: vendorEmail,
    };
    const sortMapping = {
        createdAsc: "createdAt",
        createdDsc: "-createdAt",
    };
    const sortField = sortMapping[sort] || "-createdAt";
    // Fetch data from database
    const { data, totalRecords, totalPages, prevPage, nextPage } = yield (0, product_services_1.findArchivedProducts)(page, limit, query, sortField);
    // Check if data exists
    if (data.length === 0) {
        throw new customError_1.default("No archived products found!", 404);
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
    yield (0, cache_1.setCache)(cacheKey, response, 120);
    // Send response
    res.status(200).json(response);
}));
exports.searchProducts = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.keyword || "";
    const sort = req.query.sort || "createdDsc";
    // Generate cache key based on search and pagination
    const cacheKey = `search_products:keyword=${search}:page=${page}:limit=${limit}:sort=${sort}`;
    // Check if the data is already cached
    const cachedData = yield (0, cache_1.getCache)(cacheKey);
    if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
    }
    // Build query
    const query = { isArchived: false };
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }
    // Sorting logic
    const sortMapping = {
        asc: "price",
        dsc: "-price",
        createdAsc: "createdAt",
        createdDsc: "-createdAt",
    };
    const sortField = sortMapping[sort] || "-createdAt";
    // Fetch products from the database
    const { data, totalRecords, totalPages, prevPage, nextPage } = yield (0, product_services_1.searchProductsService)(page, limit, query, sortField);
    if (data.length === 0) {
        throw new customError_1.default("No product data found!", 404);
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
    yield (0, cache_1.setCache)(cacheKey, response, 120);
    res.status(200).json(response);
}));
exports.getVendorProductDetails = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const vendorEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    const productId = req.params.id;
    if (!vendorEmail) {
        throw new customError_1.default("Vendor authentication failed", 401);
    }
    // **Check Redis Cache**
    const cacheKey = `vendor_products:${vendorEmail}:product:${productId}`;
    const cachedProduct = yield (0, cache_1.getCache)(cacheKey);
    if (cachedProduct) {
        return res.status(200).json({
            success: true,
            message: "Product details fetched successfully (from cache).",
            product: JSON.parse(cachedProduct),
        });
    }
    const product = yield (0, product_services_1.findProductById)(productId);
    if (!product) {
        throw new customError_1.default("Product not found!", 404);
    }
    if (product.vendorEmail !== vendorEmail) {
        throw new customError_1.default("You are not authorized to view this product", 403);
    }
    yield (0, cache_1.setCache)(cacheKey, product, 120);
    res.status(200).json({
        success: true,
        message: "Product details fetched successfully.",
        product,
    });
}));
