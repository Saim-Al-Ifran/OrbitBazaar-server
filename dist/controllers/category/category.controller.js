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
exports.deleteCategory = exports.updateCategory = exports.addCategory = exports.getCategoryById = exports.findAllCategoriesForAdmin = exports.findAllCategories = void 0;
const TryCatch_1 = require("../../middlewares/TryCatch");
const category_services_1 = require("../../services/category/category.services");
const customError_1 = __importDefault(require("../../utils/errors/customError"));
const cache_1 = require("../../utils/cache");
exports.findAllCategories = (0, TryCatch_1.TryCatch)((_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield (0, category_services_1.getAllCategories)();
    res.status(200).json({
        success: true,
        data: categories,
    });
}));
exports.findAllCategoriesForAdmin = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search;
    const cacheKey = `categories_page_${page}_limit_${limit}_search_${search || "all"}`;
    const cachedCategories = yield (0, cache_1.getCache)(cacheKey);
    if (cachedCategories) {
        return res.json(JSON.parse(cachedCategories));
    }
    const query = search
        ? { name: { $regex: search, $options: "i" } }
        : {};
    const { data, totalRecords, totalPages, prevPage, nextPage } = yield (0, category_services_1.getAllCategoriesForAdmin)(page, limit, query);
    if (data.length === 0) {
        throw new customError_1.default("No categories data found!", 404);
    }
    const categoryResponse = {
        success: true,
        message: "Categories fetched successfully.",
        data,
        pagination: {
            totalRecords,
            totalPages,
            prevPage,
            nextPage,
            currentPage: page,
        },
    };
    yield (0, cache_1.setCache)(cacheKey, categoryResponse, 60);
    return res.status(200).json(categoryResponse);
}));
exports.getCategoryById = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const cacheKey = `category_${id}`;
    const cachedCategory = yield (0, cache_1.getCache)(cacheKey);
    if (cachedCategory) {
        return res.status(200).json(JSON.parse(cachedCategory));
    }
    const category = yield (0, category_services_1.findCategoryById)(id);
    const categoryResponse = {
        success: true,
        message: "Category fetched successfully.",
        data: category,
    };
    yield (0, cache_1.setCache)(cacheKey, categoryResponse, 60);
    res.status(200).json(categoryResponse);
}));
exports.addCategory = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, file } = req;
    if (!file) {
        throw new customError_1.default("Image file is required.", 404);
    }
    const category = yield (0, category_services_1.createCategory)(body, file);
    yield (0, cache_1.deleteCacheByPattern)("categories_page_*");
    return res.status(201).json({
        success: true,
        message: "Category created successfully.",
        data: category,
    });
}));
exports.updateCategory = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updates = req.body;
    const file = req.file;
    const cacheKey = `category_${id}`;
    const category = yield (0, category_services_1.findCategoryById)(id);
    if (!category) {
        throw new customError_1.default("Category not found.", 404);
    }
    if (file) {
        if (category.image) {
            yield (0, category_services_1.deleteCategoryImage)(category.image);
        }
        const newImageUrl = yield (0, category_services_1.uploadCategoryImage)(file);
        updates.image = newImageUrl;
    }
    const updatedCategory = yield (0, category_services_1.updateCategoryInDb)(id, updates);
    yield (0, cache_1.deleteCacheByPattern)("categories_page_*");
    yield (0, cache_1.deleteCache)(cacheKey);
    res.status(200).json({
        success: true,
        message: "Category updated successfully.",
        data: updatedCategory,
    });
}));
exports.deleteCategory = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const cacheKey = `category_${id}`;
    const category = yield (0, category_services_1.findCategoryById)(id);
    if (!category) {
        throw new customError_1.default("Category not found.", 404);
    }
    // Delete the category image from Cloudinary (if exists)
    if (category.image) {
        yield (0, category_services_1.deleteCategoryImage)(category.image);
    }
    // Delete the category from the database
    yield (0, category_services_1.deleteCategoryFromDb)(id);
    yield (0, cache_1.deleteCacheByPattern)("categories_page_*");
    yield (0, cache_1.deleteCache)(cacheKey);
    res.status(200).json({
        success: true,
        message: "Category deleted successfully.",
    });
}));
