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
exports.getAllProducts = void 0;
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
    console.log(query);
    // Sorting logic
    const sortOption = req.query.sort;
    const sortMapping = {
        "low-price": "price",
        "high-price": "-price",
        rating: "-ratings.average",
    };
    const sortField = sortMapping[sortOption] || "createdAt";
    console.log(sortField);
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
