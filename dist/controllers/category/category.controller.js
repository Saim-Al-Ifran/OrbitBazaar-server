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
exports.addCategory = exports.findAllCategoriesForAdmin = exports.findAllCategories = void 0;
const TryCatch_1 = require("../../middlewares/TryCatch");
const category_services_1 = require("../../services/category/category.services");
const customError_1 = __importDefault(require("../../utils/errors/customError"));
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
    const query = search
        ? { name: { $regex: search, $options: 'i' } }
        : {};
    const { data, totalRecords, totalPages, prevPage, nextPage } = yield (0, category_services_1.getAllCategoriesForAdmin)(page, limit, query);
    if (data.length === 0) {
        throw new customError_1.default('No categories data found!', 404);
    }
    res.status(200).json({
        success: true,
        message: "Categories fetched successfully.",
        data,
        pagination: {
            totalRecords,
            totalPages,
            prevPage,
            nextPage,
            currentPage: page
        }
    });
}));
exports.addCategory = (0, TryCatch_1.TryCatch)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { body, file } = req;
    if (!file) {
        throw new customError_1.default('Image file is required.', 404);
    }
    const category = yield (0, category_services_1.createCategory)(body, file);
    res.status(201).json({
        success: true,
        message: "Category created successfully.",
        data: category,
    });
}));
